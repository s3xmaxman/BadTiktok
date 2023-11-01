import { SingleCommentCompTypes } from "@/app/types";
import ClientOnly from "../ClientOnly";
import Link from "next/link";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";
import { useCommentStore } from "@/app/stores/comment";
import { useUser } from "@/app/context/user";
import useDeleteComment from "@/app/hooks/useDeleteComment";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import moment from "moment";


export default function SingleComment({ comment, params }: SingleCommentCompTypes) {
    
    const contextUser = useUser();
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    let { setCommentsByPost } = useCommentStore()
    

    const deleteThisComment = async () => {
        let res = confirm("Are you sure you weant to delete this comment?")
        if (!res) return

        try {
            setIsDeleting(true)
            await useDeleteComment(comment?.id)
            setCommentsByPost(params?.postId)
            setIsDeleting(false)
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }
    
    return (
        <>
            <div 
                id="SingleComment" 
                className="flex items-center justify-between px-8 mt-4"
            >
                <div className="flex items-center relative w-full">
                    <Link href={`/profile/${comment.profile.user_id}`}>
                        <img 
                            src={useCreateBucketUrl(comment.profile.image)}
                            width="40"
                            className="absolute top-0 rounded-full lg:mx-0 mx-auto"
                        />
                    </Link>
                    <div className="ml-14 pt-0.5 w-full">
                        <div className="text-[18px] font-semibold flex items-center justify-between">
                           <span className="flex items-center">
                                {comment?.profile?.name} -
                               <span className="text-[12px] text-gray-600 font-light ml-1">
                                {moment(comment?.created_at).calendar()}
                               </span>
                           </span>
                           {contextUser?.user?.id == comment?.profile?.user_id ? (
                               <button
                                    disabled={isDeleting}
                                    onClick={() => deleteThisComment()}
                               >
                                    {isDeleting  
                                        ? <BiLoaderCircle className="anime-spin" color="#E91E62" size="20"/>
                                        : <BsTrash3 className="cursor-pointer" size="25" />
                                    }
                               </button>
                           ):null}
                        </div>
                        <p className="text-[15px] font-light">{comment.text}</p>
                    </div>
                </div>
            </div>
        </>
    )
}