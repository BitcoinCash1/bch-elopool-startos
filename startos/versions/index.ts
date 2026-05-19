import { VersionGraph } from '@start9labs/start-sdk'
import { v_1_1_1_1 } from './v1.1.1.1'
import { v_1_1_1_0 } from './v1.1.1.0'
import { v_1_1_0_1 } from './v1.1.0.1'
import { v_1_1_0_0 } from './v1.1.0.0'

export const versionGraph = VersionGraph.of({
  current: v_1_1_1_1,
  other: [v_1_1_1_0, v_1_1_0_1, v_1_1_0_0],
})
