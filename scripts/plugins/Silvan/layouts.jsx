// Append these templates to layout map
class_template_map[normal_class].other.push(SilvanExtendedTemplate);
class_template_map[mdfc_front_class].other.push(SilvanMDFCFrontTemplate);
class_template_map[mdfc_back_class].other.push(SilvanMDFCBackTemplate);

// Uncomment these to make them your default MDFC templates
class_template_map[mdfc_front_class].default_ = SilvanMDFCFrontTemplate;
class_template_map[mdfc_back_class].default_ = SilvanMDFCBackTemplate;