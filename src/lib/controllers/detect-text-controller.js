import { ClientAdapters } from 'alpheios-client-adapters'
import NotificationSingleton from '@/lib/notifications/notification-singleton'
import Langs from '@/lib/data/langs/langs.js'

const detectedTexts = {}

export default class DetectTextController {
  /**
   * This is a max amount of text that would be send to the detection service
   */
  static get maxAmountOfText () {
    return 200
  }

  /**
   * Checks if text is plain text or xml.
   * If it is a plain text - than application will send a request to language detection API and defines direction from language.
   * @param {SourceText} sourceText
   * @returns {Object}
   *          {String} sourceType - text/tei
   *          {String} lang - only for text
   *          {String} direction - only for text
   */
  static async detectTextProperties (sourceText) {
    if (this.isAlreadyDetected(sourceText) || sourceText.startedDetection) { return }
    const sourceType = this.checkXML(sourceText)

    if (sourceType === 'tei') {
      this.addToDetected(sourceText)
      return { sourceType }
    }

    sourceText.startedDetection = true

    const adapterDetectLangRes = await ClientAdapters.detectlangGroup.detectlang({
      method: 'getDetectedLangsList',
      params: {
        text: sourceText.text.substr(0, this.maxAmountOfText),
        api: process.env.DETECT_LANG_API
      }
    })

    if (adapterDetectLangRes.errors.length > 0) {
      adapterDetectLangRes.errors.forEach(error => {
        console.error(error.message)
        NotificationSingleton.addNotification({
          text: error.message,
          type: NotificationSingleton.types.ERROR
        })
      })
      return
    }
    this.addToDetected(sourceText)
    return {
      lang: adapterDetectLangRes.result,
      direction: Langs.defineDirection(adapterDetectLangRes.result),
      sourceType
    }
  }

  /**
   *
   * @param {String} sourceText
   * @returns {String} - tei/text
   */
  static checkXML (sourceText) {
    const checkStartText = sourceText.text.substring(0, 20)
    const checkRegExp1 = /^[ ]*</u

    const checkEndText = sourceText.text.substring(sourceText.text.length - 20)
    const checkRegExp2 = />[ ]*$/u

    return checkRegExp1.test(checkStartText) && checkRegExp2.test(checkEndText) ? 'tei' : 'text'
  }

  /**
   * @param {SourceText} sourceText
   */
  static addToDetected (sourceText) {
    detectedTexts[sourceText.id] = true
  }

  /**
   * @param {SourceText} sourceText
   */
  static removeFromDetected (sourceText) {
    detectedTexts[sourceText.id] = false
  }

  /**
   * @param {SourceText} sourceText
   */
  static isAlreadyDetected (sourceText) {
    return detectedTexts[sourceText.id]
  }
}
