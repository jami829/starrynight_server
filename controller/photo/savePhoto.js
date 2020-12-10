const { Photo } = require("../../models");
const jwt = require("jsonwebtoken");
const KEY = process.env.SECRET_KEY;

module.exports = {
  post: async (req, res) => {
    try {
      const { title, photoPath, location } = req.body;
      const userToken = req.headers.authorization;

      // Token을 decoding 한다
      let token = userToken;
      let decode = jwt.verify(token, KEY);
      console.log("**** Token Decode 정보 : ", decode);
      console.log(`*** 사진저장 정보 :
      userId      :::>  ${decode.id}
      photoTitle  :::>  ${title}
      photoPath   :::>  ${photoPath}
      location    :::>  ${location}
      `);

      const newPhoto = await Photo.create({
        userId: decode.id,
        photoTitle: title,
        photoPath: photoPath,
        location: location,
      });
      res.status(201).json({ ...newPhoto, success: true });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  },
};
