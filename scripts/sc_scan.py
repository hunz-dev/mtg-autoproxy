import scrython
import requests
import imageio
import numpy as np
from numpy.fft import fft2, ifft2, fftshift, ifftshift
from skimage.transform import resize


# Maybe shouldn't be here, but it's published on their own website ¯\_(ツ)_/¯
DEEPAI_KEY = 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'


def process_scan(card, cardname):
    # Retrieve and process the art scan for this card.
    # Throw scryfall scan through waifu2x
    print("Throwing scryfall scan through waifu2x")
    r = requests.post(
        "https://api.deepai.org/api/waifu2x",
        data={
            # 'image': card.image_uris()['art_crop'],
            'image': card["image_uris"]["art_crop"]
        },
        headers={'api-key': DEEPAI_KEY}
    )
    output_url = r.json()['output_url']
    im = imageio.imread(output_url)

    # Read in filter image
    print("Successfully upscaled image. Filtering...")
    filterimage = np.copy(imageio.imread("./filter.png"))

    # Resize filter to shape of input image
    filterimage = resize(filterimage, [im.shape[0], im.shape[1]], anti_aliasing=True, mode="edge")

    # Initialise arrays
    im_filtered = np.zeros(im.shape, dtype=np.complex_)
    im_recon = np.zeros(im.shape, dtype=np.float_)

    # Apply filter to each RGB channel individually
    for i in range(0, 3):
        im_filtered[:, :, i] = np.multiply(fftshift(fft2(im[:, :, i])), filterimage)
        im_recon[:, :, i] = ifft2(ifftshift(im_filtered[:, :, i])).real

    # Scale between 0 and 255 for uint8
    minval = np.min(im_recon)
    maxval = np.max(im_recon)
    im_recon_sc = 255*((im_recon - minval)/(maxval - minval))

    # Write image to disk, casting to uint8
    imageio.imwrite("../art_raw/" + cardname + " (" + card["artist"] + ").jpg", im_recon_sc.astype(np.uint8))
    print("Successfully processed scan for {}.".format(cardname))


if __name__ == "__main__":
    cardname = input("Card name (exact): ")
    try:
        # If the card specifies which set to retrieve the scan from, do that
        try:
            pipe_idx = cardname.index("|")
            query = cardname[0:pipe_idx] + " set=" + cardname[pipe_idx + 1:]
            card = scrython.cards.Search(q=query).data()[0]
            print("Processing: " + cardname[0:pipe_idx] + ", set: " + cardname[pipe_idx + 1:])
            cardname = cardname[0:pipe_idx]
        except (ValueError, scrython.foundation.ScryfallError):
            card = scrython.cards.Named(fuzzy=cardname).scryfallJson
            print("Processing: " + cardname)

        # Handle case of transform card
        if card["layout"] == "transform":
            card_idx = [card["card_faces"][x]["name"] for x in range(0, 2)].index(cardname)
            card["image_uris"] = {}
            card["image_uris"]["art_crop"] = card["card_faces"][card_idx]["image_uris"]["art_crop"]
            card["name"] = card["card_faces"][card_idx]["name"]

        # If the card is on Scryfall with that exact name:
        if card["name"] == cardname:
            process_scan(card, cardname)
        else:
            print("Couldn't find that card.")
    except Exception as e:
        print("Exception: " + str(e))
    input("Press enter to continue.")
