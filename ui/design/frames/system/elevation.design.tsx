// Proposal (2026-11-08): one elevation system for the Web UI. Shadows say only how high a surface
// sits (0 flat, 1 raised, 2 floating, 3 overlay), each with a Light and a Dark value; selected,
// unread, active, and expanded are fill, border, and ring, never a shadow or a glow; a glow is kept
// for what emits light (a running dot, a live microphone, the brand CTA) and, in Dark only, for brand
// decoration. The rules and tokens are in kit/elevation/elevation.css.
//
// Each `after` frame draws a shipped frame unchanged, inside <ElevationProposal>, so the pair differs
// only by the proposal. The shipped frame it pairs with is named in its title.
import { BackendLifecycleChip } from '@/components/settings/BackendLifecycleChip';

import { frames, type FrameSpec } from '../../frame';
import { ElevationProposal } from '../../kit/elevation/ElevationProposal';
import { ElevationSheet } from '../../kit/elevation/ElevationSheet';
import agentDialogs from '../agents/dialogs.design';
import agentsPage from '../agents/agents-page.design';
import dock from '../apps/dock.design';
import chatComposer from '../chat/composer.design';
import chatConversation from '../chat/conversation.design';
import home from '../home/home.design';
import inboxPage from '../inbox/inbox-page.design';
import appsDrawer from '../mobile/apps-drawer.design';
import workbenchTab from '../mobile/workbench-tab.design';
import inboxPopover from '../sidebar/inbox-popover.design';
import sidebarBots from '../sidebar/bots.design';
import workbenchSidebar from '../sidebar/workbench-sidebar.design';
import { RUNTIMES } from '../models/backends.fixtures';
import overlays from './overlays.design';
import { systemFixtures } from './fixtures';

const shipped = (file: string, specs: FrameSpec[], state: string): FrameSpec => {
  const spec = specs.find((candidate) => candidate.name === state);
  if (!spec) throw new Error(`no frame ${file}/${state}`);
  return spec;
};

/** The shipped frame `<file>/<state>`, drawn under the proposal. */
const after = (name: string, file: string, specs: FrameSpec[], state: string): FrameSpec => {
  const spec = shipped(file, specs, state);
  return {
    ...spec,
    name,
    title: `提案 · ${spec.title}（对照 ${file}/${state}）`,
    status: 'proposed',
    render: () => <ElevationProposal>{spec.render()}</ElevationProposal>,
  };
};

// A toast over content: the shipped toast frame raises one over an empty page, where a see-through
// fill cannot show. The same trigger, with a page of transcript-like text under the toast's corner.
const filler = Array.from({ length: 14 }, (_, i) => i);
const toastOverContent = () => (
  <div className="relative h-full">
    <div className="flex flex-col gap-3 p-6 pt-16 pr-8 text-[13px] leading-relaxed text-foreground">
      {filler.map((i) => (
        <p key={i}>
          已经读完现有 Web UI 代码。收件箱、项目、新建会话和应用各自一个入口，聊天页和搜索页全屏，进入时隐藏底栏。项目页按最近活跃排序，长按可以置顶。
        </p>
      ))}
    </div>
    <div className="absolute right-6 top-4">
      <BackendLifecycleChip name="codex" enabled cliStatus="ok" cliPath="codex" detectedRuntime={RUNTIMES.codex} />
    </div>
  </div>
);
const toastFrame = {
  width: 800,
  height: 560,
  fixtures: systemFixtures({ '/api/backend/codex/runtime': RUNTIMES.codex, '/api/backend/codex/restart': { ok: true, message: '' } }),
  click: ['role=button[name="{t:backendLifecycle.statusReady}"]', 'role=button[name="{t:backendLifecycle.restart}"]'],
};

const designFrames = frames([
  {
    name: 'scale',
    title: '提案 · 层级、状态与光',
    width: 1180,
    height: 860,
    status: 'proposed',
    fixtures: systemFixtures(),
    render: () => (
      <ElevationProposal>
        <ElevationSheet />
      </ElevationProposal>
    ),
  },

  // Desktop pages.
  after('inbox-unread', 'inbox/inbox-page', inboxPage, 'unread'),
  after('inbox-popover', 'sidebar/inbox-popover', inboxPopover, 'open'),
  after('sidebar-hover-card', 'sidebar/bots', sidebarBots, 'hover-card'),
  after('sidebar-selected', 'sidebar/workbench-sidebar', workbenchSidebar, 'skills-selected'),
  after('chat', 'chat/conversation', chatConversation, 'default'),
  after('composer-route-picker', 'chat/composer', chatComposer, 'route-picker'),
  after('agents', 'agents/agents-page', agentsPage, 'definitions'),
  after('agents-new', 'agents/dialogs', agentDialogs, 'new-agent'),
  after('dock', 'apps/dock', dock, 'open'),
  after('home', 'home/home', home, 'b-partial-desktop'),
  after('menu', 'system/overlays', overlays, 'menu'),
  after('context-menu', 'system/overlays', overlays, 'context-menu'),
  after('popover', 'system/overlays', overlays, 'popover'),
  after('dialog', 'system/overlays', overlays, 'dialog'),
  { name: 'toast-before', title: '现状 · 提示条盖在内容上', status: 'shipped', ...toastFrame, render: toastOverContent },
  {
    name: 'toast',
    title: '提案 · 提示条盖在内容上（对照 system/elevation/toast-before）',
    status: 'proposed',
    ...toastFrame,
    render: () => <ElevationProposal>{toastOverContent()}</ElevationProposal>,
  },

  // Phone.
  after('phone-inbox', 'inbox/inbox-page', inboxPage, 'phone'),
  after('phone-chat', 'chat/conversation', chatConversation, 'phone'),
  after('phone-tabbar', 'mobile/workbench-tab', workbenchTab, 'team'),
  after('phone-tabbar-member', 'mobile/workbench-tab', workbenchTab, 'member'),
  after('phone-tabbar-recording', 'mobile/workbench-tab', workbenchTab, 'hold-main-recording'),
  after('phone-apps-drawer', 'mobile/apps-drawer', appsDrawer, 'open'),
  after('phone-menu', 'system/overlays', overlays, 'menu-phone'),
  after('phone-dialog', 'system/overlays', overlays, 'dialog-phone'),
]);

export default designFrames;
