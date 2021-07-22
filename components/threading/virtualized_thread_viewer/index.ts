// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getDirectTeammate} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/common';
import {isCollapsedThreadsEnabled} from 'mattermost-redux/selectors/entities/preferences';

import {$ID} from 'mattermost-redux/types/utilities';
import {Channel} from 'mattermost-redux/types/channels';
import {Post} from 'mattermost-redux/types/posts';

import {FakePost} from 'types/store/rhs';

import {getHighlightedPostId} from 'selectors/rhs';
import {makePrepareReplyIdsForThreadViewer, makeGetThreadLastViewedAt} from 'selectors/views/threads';

import {GlobalState} from 'types/store';

import ThreadViewerVirtualized from './virtualized_thread_viewer';

type OwnProps = {
    channel: Channel;
    openTime: number;
    postIds: Array<$ID<Post | FakePost>>;
    selected: Post | FakePost;
    useRelativeTimestamp: boolean;
}

function makeMapStateToProps() {
    const getRepliesListWithSeparators = makePrepareReplyIdsForThreadViewer();
    const getThreadLastViewedAt = makeGetThreadLastViewedAt();

    return (state: GlobalState, ownProps: OwnProps) => {
        const collapsedThreads = isCollapsedThreadsEnabled(state);
        const {postIds, useRelativeTimestamp, selected, openTime, channel} = ownProps;

        const currentUserId = getCurrentUserId(state);
        const lastViewedAt = getThreadLastViewedAt(state, selected.id);
        const directTeammate = getDirectTeammate(state, channel.id);
        const highlightedPostId = getHighlightedPostId(state);

        const lastPost = getPost(state, postIds[0]);

        const replyListIds = getRepliesListWithSeparators(state, {
            postIds,
            showDate: !useRelativeTimestamp,
            lastViewedAt,
            collapsedThreads,
            openTime,
        });

        return {
            currentUserId,
            directTeammate,
            highlightedPostId,
            lastPost,
            replyListIds,
            teamId: channel.team_id,
        };
    };
}

export default connect(makeMapStateToProps)(ThreadViewerVirtualized);
