import { v4 as uuidv4 } from 'uuid'
import Token from '@/lib/data/token'

export default class HistoryStep {
  constructor (token, type) {
    this.id = uuidv4()
    this.token = token
    this.type = type
  }

  /**
   * @returns {String} - origin/target
   */
  get textType () {
    return this.token instanceof Token ? this.token.textType : null
  }

  /**
   * @returns {String}
   */
  get idWord () {
    return this.token instanceof Token ? this.token.idWord : null
  }

  /**
   * @returns {Boolean} - true - step type is correctly defined, false - if not
   */
  get hasValidType () {
    return Object.values(this.constructor.types).includes(this.type)
  }
}

HistoryStep.types = {
  //
  ADD: 'add',
  //
  REMOVE: 'remove',
  //
  UPDATE: 'update',
  //
  MERGE: 'merge',
  //
  SPLIT: 'split',
  //
  ADD_LINE_BREAK: 'add line break',
  //
  REMOVE_LINE_BREAK: 'remove line break',
  //
  TO_NEXT_SEGMENT: 'to next segment',
  //
  TO_PREV_SEGMENT: 'to prev segment',
  //
  NEW: 'new',
  //
  NEW_AFTER: 'new after',
  //
  NEW_BEFORE: 'new before',
  //
  NEW_SOURCE: 'source for new',
  //
  DELETE: 'delete',
  //
  START_GROUP: 'start group',
  //
  FINISH_GROUP: 'finish group',
  //
  ACTIVATE_GROUP: 'activate group'
}

HistoryStep.directions = {
  //
  PREV: 'prev',
  //
  NEXT: 'next'
}
