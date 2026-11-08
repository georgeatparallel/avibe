import type { FrameSpec } from '../../frame';
import { ElevationProposal, type ElevationVersion } from './ElevationProposal';

/** The frame named `state` in a design file's frames. */
export const pick = (file: string, specs: FrameSpec[], state: string): FrameSpec => {
  const spec = specs.find((candidate) => candidate.name === state);
  if (!spec) throw new Error(`no frame ${file}/${state}`);
  return spec;
};

const LABEL: Record<ElevationVersion, string> = { v1: '提案', v2a: '提案 v2a 克制', v2b: '提案 v2b 表现' };

/** A frame drawn unchanged under one version of the proposal; `of` names the frame it pairs with. */
export const proposed = (spec: FrameSpec, name: string, version: ElevationVersion, of: string, title = spec.title): FrameSpec => ({
  ...spec,
  name,
  title: `${LABEL[version]} · ${title.replace(/^现状 · /, '')}（对照 ${of}）`,
  status: 'proposed',
  render: () => <ElevationProposal version={version}>{spec.render()}</ElevationProposal>,
});
