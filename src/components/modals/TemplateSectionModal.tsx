import { App } from 'obsidian'

import { ReactModal } from '../common/ReactModal'
import { TemplateSection } from '../settings/sections/TemplateSection'

type TemplateSectionProps = {
  app: App
}

export class TemplateSectionModal extends ReactModal<TemplateSectionProps> {
  constructor(app: App) {
    super({
      app: app,
      Component: TemplateSection,
      props: {
        app,
      },
    })
    this.modalEl.classList.add('smtcmp-modal--wide')
  }
}
