import { Llement } from "./llement";

export interface Props {
  key: string
}

export type moveMap = Object & {
  // 用于删除及添加节点
  index?: number,
  // 差异类型
  type: number,
  item?: Llement | string,
  moves?: Array<moveMap>
  // 文本差异
  content?: string,
  // 属性差异
  props?: object,
  // 节点替换
  node?: Llement
}

export type diffMap = Object & {
  moveList: Array<moveMap>,
  children: Array<Llement | string | null>
}

export type domPatchType = {
  REPLACE: number,
  REORDER: number,
  PROPS: number,
  TEXT: number,
  REMOVE: number,
  ADD: number
}

export let domPatch: domPatchType = {
  REPLACE: 0,
  REORDER: 1,
  PROPS: 2,
  TEXT: 3,
  REMOVE: 4,
  ADD: 5
}