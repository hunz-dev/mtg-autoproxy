function determine_symbol_colours_jpma(symbol, symbol_length) {
    /**
     * Determines the colours of a symbol (represented as Scryfall string) and returns an array of SolidColor objects.
     * Specifically for JP Mystical Archive
     */

    const symbol_colour_map = {
        "W": jrgb_w, "U": jrgb_u, "B": jrgb_c, "R": jrgb_r, "G": jrgb_g, "2": jrgb_c,
    }

    // for hybrid symbols with generic mana, use the black symbol colour rather than colourless for B
    const hybrid_symbol_colour_map = {
        "W": jrgb_w, "U": jrgb_u, "B": jrgb_b, "R": jrgb_r, "G": jrgb_g, "2": jrgb_c,
    }

    if (symbol === "{E}" || symbol === "{CHAOS}") {
        // energy or chaos symbols
        return [rgb_black()];
    } else if (symbol === "{S}") {
        // snow symbol
        return [rgb_c, rgb_black(), rgb_white()];
    } else if (symbol == "{Q}") {
        // untap symbol
        return [rgb_black(), rgb_white()];
    }

    var phyrexian_regex = /^\{([W,U,B,R,G])\/P\}$/;
    var phyrexian_match = symbol.match(phyrexian_regex);
    if (phyrexian_match !== null) {
        return [hybrid_symbol_colour_map[phyrexian_match[1]], rgb_black()];
    }

    var hybrid_regex = /^\{([2,W,U,B,R,G])\/([W,U,B,R,G])\}$/;
    var hybrid_match = symbol.match(hybrid_regex);
    if (hybrid_match !== null) {
        var colour_map = symbol_colour_map;
        if (hybrid_match[1] == "2") {
            // Use the darker colour for black's symbols for 2/B hybrid symbols
            colour_map = hybrid_symbol_colour_map;
        }
        return [
            colour_map[hybrid_match[2]],
            colour_map[hybrid_match[1]],
            rgb_black(),
            rgb_black()
        ];
    }

    var normal_symbol_regex = /^\{([W,U,B,R,G])\}$/;
    var normal_symbol_match = symbol.match(normal_symbol_regex);
    if (normal_symbol_match !== null) {
        return [symbol_colour_map[normal_symbol_match[1]], rgb_black()];
    }

    if (symbol_length == 2) {
        return [jrgb_c, rgb_black()];
    }

    throw new Error("Encountered a symbol that I don't know how to colour: " + symbol);
}