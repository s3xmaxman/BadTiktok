import { Like } from "../types";

// ユーザーが投稿に「いいね!」しているか判定する関数
const userIsLiked = (userId: string, postId: string, likes: Array<Like>) => {

    // 結果を入れる配列を初期化
    let res: Like[] = [];
  
    // 「いいね!」の配列をループ
    likes.forEach((like) => {
  
      // ユーザーIDと投稿IDが一致する「いいね!」を抽出
      if (like.user_id === userId && like.post_id === postId) {
        res.push(like)
      }
    })
  
    // 抽出結果がundefinedの場合は初期値を返す
    if (typeof res === "undefined") return ;
  
    // 抽出結果の配列の長さで「いいね!」の有無を判定
    return res.length > 0
  }

export default userIsLiked