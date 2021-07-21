// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, useCallback} from 'react';
import {useDispatch} from 'react-redux';

import {removePost} from 'mattermost-redux/actions/posts';

import {Post} from 'mattermost-redux/types/posts';

import RhsComment from 'components/rhs_comment';

export type OwnProps = {
    a11Index: number;
    currentUserId: string;
    id: string;
    isLastPost: boolean;
    onCardClick: (post: Post) => void;
    previewCollapsed: string;
    previewEnabled: boolean;
    previousPostId: string;
    teamId: string;
    timestampProps?: any;
}

type Props = OwnProps & {
    post: Post;
}

function Repy({
    a11Index,
    currentUserId,
    isLastPost,
    onCardClick,
    post,
    previewCollapsed,
    previewEnabled,
    previousPostId,
    teamId,
    timestampProps,
}: Props) {
    const dispatch = useDispatch();

    const handleRemovePost = useCallback((post: Post) => {
        dispatch(removePost(post));
    }, []);

    return (
        <RhsComment
            a11Index={a11Index}
            currentUserId={currentUserId}
            handleCardClick={onCardClick}
            isLastPost={isLastPost}
            post={post}
            previewCollapsed={previewCollapsed}
            previewEnabled={previewEnabled}
            previousPostId={previousPostId}
            removePost={handleRemovePost}
            teamId={teamId}
            timestampProps={timestampProps}
        />
    );
}

export default memo(Repy);