// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {isChannelReadOnlyById} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {makeGetReactionsForPost, getPost} from 'mattermost-redux/selectors/entities/posts';
import {getUser, makeGetDisplayName} from 'mattermost-redux/selectors/entities/users';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {get, isCollapsedThreadsEnabled} from 'mattermost-redux/selectors/entities/preferences';

import {markPostAsUnread, emitShortcutReactToLastPostFrom} from 'actions/post_actions.jsx';
import {isEmbedVisible} from 'selectors/posts';
import {getEmojiMap} from 'selectors/emojis';
import {getHighlightedPostId} from 'selectors/rhs';

import {isArchivedChannel} from 'utils/channel_utils';
import {areConsecutivePostsBySameUser} from 'utils/post_utils';
import {Preferences} from 'utils/constants';

import {getShortcutReactToLastPostEmittedFrom} from 'selectors/emojis.js';

import RhsComment from './rhs_comment.jsx';

function isConsecutivePost(state, ownProps) {
    const post = ownProps.post;
    const previousPost = ownProps.previousPostId && getPost(state, ownProps.previousPostId);

    let consecutivePost = false;

    if (previousPost) {
        consecutivePost = areConsecutivePostsBySameUser(post, previousPost);
    }
    return consecutivePost;
}

function mapStateToProps(state, ownProps) {
    const getReactionsForPost = makeGetReactionsForPost();
    const getDisplayName = makeGetDisplayName();
    const emojiMap = getEmojiMap(state);

    const config = getConfig(state);
    const enableEmojiPicker = config.EnableEmojiPicker === 'true';
    const enablePostUsernameOverride = config.EnablePostUsernameOverride === 'true';
    const teamId = ownProps.teamId || getCurrentTeamId(state);
    const channel = state.entities.channels.channels[ownProps.post.channel_id];
    const shortcutReactToLastPostEmittedFrom = getShortcutReactToLastPostEmittedFrom(state);

    const user = getUser(state, ownProps.post.user_id);
    const isBot = Boolean(user && user.is_bot);
    const highlightedPostId = getHighlightedPostId(state);

    return {
        author: getDisplayName(state, ownProps.post.user_id),
        reactions: getReactionsForPost(state, ownProps.post.id),
        enableEmojiPicker,
        enablePostUsernameOverride,
        isEmbedVisible: isEmbedVisible(state, ownProps.post.id),
        isReadOnly: isChannelReadOnlyById(state, ownProps.post.channel_id),
        teamId,
        pluginPostTypes: state.plugins.postTypes,
        channelIsArchived: isArchivedChannel(channel),
        isConsecutivePost: isConsecutivePost(state, ownProps),
        isFlagged: get(state, Preferences.CATEGORY_FLAGGED_POST, ownProps.post.id, null) != null,
        compactDisplay: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.MESSAGE_DISPLAY, Preferences.MESSAGE_DISPLAY_DEFAULT) === Preferences.MESSAGE_DISPLAY_COMPACT,
        shortcutReactToLastPostEmittedFrom,
        emojiMap,
        isBot,
        collapsedThreadsEnabled: isCollapsedThreadsEnabled(state),
        shouldHighlight: highlightedPostId === ownProps.post.id,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            markPostAsUnread,
            emitShortcutReactToLastPostFrom,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RhsComment);
