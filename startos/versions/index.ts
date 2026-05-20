import { VersionGraph } from '@start9labs/start-sdk'
import { v_1_1_1_6 } from './v1.1.1.6'
import { v_1_1_1_5 } from './v1.1.1.5'
import { v_1_1_1_4 } from './v1.1.1.4'
import { v_1_1_1_3 } from './v1.1.1.3'
import { v_1_1_1_2 } from './v1.1.1.2'
import { v_1_1_1_1 } from './v1.1.1.1'
import { v_1_1_1_0 } from './v1.1.1.0'
import { v_1_1_0_1 } from './v1.1.0.1'
import { v_1_1_0_0 } from './v1.1.0.0'

export const versionGraph = VersionGraph.of({
  current: v_1_1_1_6,
  other: [v_1_1_1_5, v_1_1_1_4, v_1_1_1_3, v_1_1_1_2, v_1_1_1_1, v_1_1_1_0, v_1_1_0_1, v_1_1_0_0],
})
