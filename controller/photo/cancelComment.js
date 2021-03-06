const { Reply } = require("../../models");
const jwt = require("jsonwebtoken");
const KEY = process.env.SECRET_KEY;

module.exports = {
  post: async (req, res) => {
    try {
      // 클라이언트로부터 로그인 토큰정보, 댓글을 받아온다
      const { commentId, comment, photoId } = req.body;
      const userToken = req.headers.authorization;

      // Token을 decoding 한다
      let token = userToken;
      let decode = jwt.verify(token, KEY);

      // 인스턴스들 중 사용자가 취소하고자 하는 댓글을 확인한다
      const wasReplied = await Reply.findOne({
        where: {
          id: commentId,
          writerId: decode.id,
          comment: comment,
          photoId: photoId,
        },
      });

      // 댓글정보를 삭제한다
      const delReply = await Reply.destroy({
        where: {
          id: wasReplied.dataValues.id,
          writerId: wasReplied.dataValues.writerId,
          comment: wasReplied.dataValues.comment,
          photoId: wasReplied.dataValues.photoId,
        },
      });

      // 댓글삭제 성공 시 success: true 값을 보내준다
      res.status(201).json({ success: true });
    } catch (err) {
      // 댓글 생성 실패 시 success: false 값을 보내준다
      res.status(500).json({ success: false });
    }
  },
};
