/* =========================================================
   UNCLE MIKE — STICKER CATALOG

   HOW TO ADD A NEW STICKER:

   1. Upload the image to:
      /stickers/images/

   2. Leave the filename EXACTLY as it uploaded.

   3. Add ONE line to the correct collection below:

      [26, "gfy", "whatever-file-name.png"]

      OR

      [26, "brain", "whatever-file-name.png"]

   That's it.

   FORMAT:
   [sticker number, collection, image path]
   ========================================================= */


const UNCLE_MIKE_STICKERS = [

  /* =======================================================
     GFY COLLECTION
     Existing images stay in their current location.
     ======================================================= */

  [
    1,
    "gfy",
    "../2D06CF4C-261D-4133-B64B-116872A1C0CE.png"
  ],

  [
    2,
    "gfy",
    "../800448F2-6C0A-4009-BFEE-44762F9757AB.png"
  ],

  [
    3,
    "gfy",
    "../68BD59D5-32D0-4D26-B01D-9BA075EA7F80.png"
  ],

  [
    4,
    "gfy",
    "../377B33A1-8F06-4B25-91F4-F2ED9B401CFE.png"
  ],

  [
    5,
    "gfy",
    "../3246F0CD-1F4C-4C9B-88A1-986EEB60C397.png"
  ],

  [
    6,
    "gfy",
    "../0547ED23-02FD-4A8B-B163-76675EECB51C.png"
  ],

  [
    7,
    "gfy",
    "../E49DC6DB-EA61-4ADE-97D9-AFDF3E238F78.png"
  ],

  [
    8,
    "gfy",
    "../DE7935CB-F093-4900-9CCA-1FA60E648B29.png"
  ],

  [
    9,
    "gfy",
    "../B3D5BE20-E846-432C-A803-BEF686BBBAEF.png"
  ],

  [
    10,
    "gfy",
    "../AFA5E466-A470-444B-B73B-5BB66FD4F047.png"
  ],

  [
    11,
    "gfy",
    "../9CE55BC3-4DC7-43DA-957B-9B978289148D.png"
  ],

  [
    12,
    "gfy",
    "../IMG_7328.jpeg"
  ],


  /* =======================================================
     MY BRAIN IS BETTER THAN YOURS
     Existing images stay in their current location.
     ======================================================= */

  [
    13,
    "brain",
    "../53FBB857-6589-4B6B-AB15-511094D09D9D.png"
  ],

  [
    14,
    "brain",
    "../powered_by_autism_cutout.png"
  ],

  [
    15,
    "brain",
    "../autism_sticker_cutout.png"
  ],

  [
    16,
    "brain",
    "../autism_spark_cutout.png"
  ],

  [
    17,
    "brain",
    "../autism_champions_cutout.png"
  ],

  [
    18,
    "brain",
    "../autism_cams_cutout.png"
  ],

  [
    19,
    "brain",
    "../14FF8ADB-DFA3-48BC-B0CE-83C2BBA50ADD.png"
  ],

  [
    20,
    "brain",
    "../FD5E3664-835E-41C7-AC69-006356BAA991.png"
  ],

  [
    21,
    "brain",
    "../C3562F6C-48D5-4DA6-A7B2-CB8F89A5AC99.png"
  ],

  [
    22,
    "brain",
    "../CC263FC1-3A39-449F-997F-9FCCEE620C01.png"
  ],

  [
    23,
    "brain",
    "../ED07CB72-68C8-41A9-B713-29C0F9A1E6B6.png"
  ],

  [
    24,
    "brain",
    "../7C481E72-DD74-418F-8852-5DB20A64C752.png"
  ],

  [
    25,
    "brain",
    "../73665BA7-29B3-4596-AA3E-18256B3378EF.png"
  ]

];


/* =========================================================
   COLLECTIONS
   ========================================================= */

const UNCLE_MIKE_STICKER_COLLECTIONS = [

  {
    id: "gfy",
    title: "GFY Collection"
  },

  {
    id: "brain",
    title: "My Brain Is Better Than Yours"
  }

];


/* =========================================================
   NORMALIZE CATALOG

   Converts the tiny inventory lines above into objects
   the storefront can use.

   New images inside /stickers/images/ only need their
   filename. Existing images keep their existing paths.
   ========================================================= */

const UNCLE_MIKE_STICKER_CATALOG =
  UNCLE_MIKE_STICKERS.map(
    ([number, collection, image]) => {

      const isExistingPath =
        image.startsWith("../") ||
        image.startsWith("/") ||
        image.startsWith("./");

      return {
        number,
        collection,

        image:
          isExistingPath
            ? image
            : `../stickers/images/${image}`
      };

    }
  );
