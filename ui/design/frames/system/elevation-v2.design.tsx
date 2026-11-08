// Proposal v2 (2026-11-08): borderless edges designed with the elevation, and a freshness kit at two
// levels, v2a (restrained) and v2b (expressive). Each frame draws a shipped frame unchanged inside
// <ElevationProposal version>, so before, v1 (system/elevation/*), v2a and v2b differ only by the
// proposal. Rules and tokens: kit/elevation/elevation-v2.css, on top of kit/elevation/elevation.css.
import { frames, type FrameSpec } from '../../frame';
import { ElevationProposal } from '../../kit/elevation/ElevationProposal';
import { ElevationSheetV2 } from '../../kit/elevation/ElevationSheetV2';
import { pick, proposed } from '../../kit/elevation/pairs';
import agentDialogs from '../agents/dialogs.design';
import agentsPage from '../agents/agents-page.design';
import appsLibrary from '../apps/library.design';
import dock from '../apps/dock.design';
import chatComposer from '../chat/composer.design';
import chatConversation from '../chat/conversation.design';
import home from '../home/home.design';
import inboxPage from '../inbox/inbox-page.design';
import appsDrawer from '../mobile/apps-drawer.design';
import botConversation from '../mobile/bot-conversation.design';
import workbenchTab from '../mobile/workbench-tab.design';
import searchPalette from '../search/search-palette.design';
import settingsGeneral from '../settings/general.design';
import inboxPopover from '../sidebar/inbox-popover.design';
import sidebarBots from '../sidebar/bots.design';
import workbenchSidebar from '../sidebar/workbench-sidebar.design';
import v1 from './elevation.design';
import overlays from './overlays.design';
import { systemFixtures } from './fixtures';

// [name, the frame it draws]. A name matches its v1 frame (system/elevation/<name>).
const sources: [string, string, FrameSpec[], string][] = [
  ['inbox-unread', 'inbox/inbox-page', inboxPage, 'unread'],
  ['inbox-popover', 'sidebar/inbox-popover', inboxPopover, 'open'],
  ['sidebar-hover-card', 'sidebar/bots', sidebarBots, 'hover-card'],
  ['sidebar-selected', 'sidebar/workbench-sidebar', workbenchSidebar, 'skills-selected'],
  ['chat', 'chat/conversation', chatConversation, 'default'],
  ['composer-route-picker', 'chat/composer', chatComposer, 'route-picker'],
  ['agents', 'agents/agents-page', agentsPage, 'definitions'],
  ['agents-new', 'agents/dialogs', agentDialogs, 'new-agent'],
  ['dock', 'apps/dock', dock, 'open'],
  ['apps-library', 'apps/library', appsLibrary, 'apps'],
  ['settings-general', 'settings/general', settingsGeneral, 'default'],
  ['search-palette', 'search/search-palette', searchPalette, 'open'],
  ['home', 'home/home', home, 'b-partial-desktop'],
  ['menu', 'system/overlays', overlays, 'menu'],
  ['context-menu', 'system/overlays', overlays, 'context-menu'],
  ['popover', 'system/overlays', overlays, 'popover'],
  ['dialog', 'system/overlays', overlays, 'dialog'],
  ['phone-inbox', 'inbox/inbox-page', inboxPage, 'phone'],
  ['phone-chat', 'chat/conversation', chatConversation, 'phone'],
  ['phone-chat-running', 'mobile/bot-conversation', botConversation, 'main-running'],
  ['phone-tabbar', 'mobile/workbench-tab', workbenchTab, 'team'],
  ['phone-tabbar-member', 'mobile/workbench-tab', workbenchTab, 'member'],
  ['phone-tabbar-recording', 'mobile/workbench-tab', workbenchTab, 'hold-main-recording'],
  ['phone-apps-drawer', 'mobile/apps-drawer', appsDrawer, 'open'],
  ['phone-menu', 'system/overlays', overlays, 'menu-phone'],
  ['phone-dialog', 'system/overlays', overlays, 'dialog-phone'],
  // The review states v1 added (a toast over content, a Bot selected in the strip, a hover in Light).
  ['toast', 'system/elevation', v1, 'toast-before'],
  ['bots-selected-main', 'system/elevation', v1, 'bots-selected-main-before'],
  ['bots-selected-pm', 'system/elevation', v1, 'bots-selected-pm-before'],
  ['hover-dialog-ghost', 'system/elevation', v1, 'hover-dialog-ghost-before'],
  ['hover-agents-row', 'system/elevation', v1, 'hover-agents-row-before'],
];

const pairs = sources.flatMap(([name, file, specs, state]) => {
  const spec = pick(file, specs, state);
  return [proposed(spec, `a-${name}`, 'v2a', `${file}/${state}`), proposed(spec, `b-${name}`, 'v2b', `${file}/${state}`)];
});

const sheet = (version: 'v2a' | 'v2b') => () => (
  <ElevationProposal version={version}>
    <ElevationSheetV2 />
  </ElevationProposal>
);

const designFrames = frames([
  { name: 'a-scale', title: '提案 v2a 克制 · 边与面、鲜活度', width: 1180, height: 940, status: 'proposed', fixtures: systemFixtures(), render: sheet('v2a') },
  { name: 'b-scale', title: '提案 v2b 表现 · 边与面、鲜活度', width: 1180, height: 940, status: 'proposed', fixtures: systemFixtures(), render: sheet('v2b') },
  ...pairs,
]);

export default designFrames;
