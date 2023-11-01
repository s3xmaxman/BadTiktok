export interface UserContextTypes {
    user: User | null;
    register: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkUser: () => Promise<void>;
}

export interface Profile {
    id: string;
    user_id: string;
    name: string;
    bio: string;
    image: string;
}


export interface User {
    id: string;
    name: string;
    bio: string;
    image: string;
}

export interface RandomUsers {
    id: string;
    name: string;
    image: string;
}

export interface CropperDimensions {
    width?: number | null;
    height?: number | null;
    left?: number | null;
    top?: number | null;
}

export interface ShowErrorObject {
    type: string;
    message: string;
}

export interface Like {
    id: string;
    user_id: string;
    post_id: string;
}

export interface Post {
    id: string;
    user_id: string;
    video_url: string;
    text: string;
    created_at: string;
}

export interface CommentWithProfile {
    id: string;
    user_id: string;
    post_id: string;
    text: string;
    created_at: string;
    profile: {
        user_id: string;
        name: string;
        image: string
    }
}

export interface Comment {
    id: string;
    user_id: string;
    post_id: string;
    text: string;
    created_at: string;
}

export interface PostWithProfile {
    id: string;
    user_id: string;
    video_url: string;
    text: string;
    created_at: string;
    profile: {
        user_id: string;
        name: string;
        image: string
    }
}

export interface UploadError {
    type: string;
    message: string;
    
}


//COMPONENTS TYPES

export interface CommentsHeaderCompTypes {
    params: {
        userId: string;
        postId: string;
    };
    post: PostWithProfile;
    
}

export interface CommentsCompTypes {
    params: {
        userId: string;
        postId: string;
    }
}


export interface SingleCommentCompTypes {
    params: {
        userId: string;
        postId: string;
    };
    comment: CommentWithProfile;

}



export interface PostMainCompTypes {
    post:PostWithProfile;
}

export interface PostMainLikesCompTypes {
    post:PostWithProfile;
}

export interface PostPageTypes {
    params: {
        userId: string;
        postId: string;
    };
}

export interface PostUserCompTypes {
    post:Post
}

export interface ProfilePageTypes {
    params: {
        id: string;
    };
}

// LAYOUT INCLUDE TYPES
export interface MenuItemsTypes {
    iconString: string;
    sizeString: string;
    colorString: string;
}


export interface MenuItemFollowCompTypes {
    user: RandomUsers
}

export interface TextInputCompTypes {
    string: string;
    inputType: string;
    placeholder: string;
    error: string;
    onUpdate: (newValue: string) => void
}

