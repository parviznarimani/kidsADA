# Card records

Edit kids-identity.numbers and export UTF-8 CSV to kids-identity.csv. The live page reads the CSV, not Numbers.

Required columns: kidscard_url, kidsname, kids_identity_number, father_phone, mother_phone.

Use one unique card path and identity per row. Current identities include the img prefix: img000002 maps to faceimages/img000002.jpg. Supported lowercase extensions: jpg, jpeg, png, webp. Missing photos show the placeholder.

Store phones as text to retain leading zeros and country prefixes. The page normalizes ten-digit Iranian mobiles beginning with 9 to a leading zero for dialing. Verify intended phone numbers before use.

This folder is public when uploaded to the public repository. Use sample records and images only. See ../README.md for details.
