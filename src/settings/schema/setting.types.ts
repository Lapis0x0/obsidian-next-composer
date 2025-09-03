import { z } from 'zod'

import {
  DEFAULT_APPLY_MODEL_ID,
  DEFAULT_CHAT_MODELS,
  DEFAULT_CHAT_MODEL_ID,
  DEFAULT_EMBEDDING_MODELS,
  DEFAULT_PROVIDERS,
} from '../../constants'
import { assistantSchema } from '../../types/assistant.types'
import { chatModelSchema } from '../../types/chat-model.types'
import { embeddingModelSchema } from '../../types/embedding-model.types'
import { mcpServerConfigSchema } from '../../types/mcp.types'
import { llmProviderSchema } from '../../types/provider.types'

import { SETTINGS_SCHEMA_VERSION } from './migrations'

const ragOptionsSchema = z.object({
  chunkSize: z.number().catch(1000),
  thresholdTokens: z.number().catch(8192),
  minSimilarity: z.number().catch(0.0),
  limit: z.number().catch(10),
  excludePatterns: z.array(z.string()).catch([]),
  includePatterns: z.array(z.string()).catch([]),
})

/**
 * Settings
 */

export const smartComposerSettingsSchema = z.object({
  // Version
  version: z.literal(SETTINGS_SCHEMA_VERSION).catch(SETTINGS_SCHEMA_VERSION),

  providers: z.array(llmProviderSchema).catch([...DEFAULT_PROVIDERS]),

  chatModels: z.array(chatModelSchema).catch([...DEFAULT_CHAT_MODELS]),

  embeddingModels: z
    .array(embeddingModelSchema)
    .catch([...DEFAULT_EMBEDDING_MODELS]),

  chatModelId: z
    .string()
    .catch(
      DEFAULT_CHAT_MODELS.find((v) => v.id === DEFAULT_CHAT_MODEL_ID)?.id ??
        DEFAULT_CHAT_MODELS[0].id,
    ), // model for default chat feature
  applyModelId: z
    .string()
    .catch(
      DEFAULT_CHAT_MODELS.find((v) => v.id === DEFAULT_APPLY_MODEL_ID)?.id ??
        DEFAULT_CHAT_MODELS[0].id,
    ), // model for apply feature
  embeddingModelId: z.string().catch(DEFAULT_EMBEDDING_MODELS[0].id), // model for embedding

  // System Prompt
  systemPrompt: z.string().catch(''),

  // RAG Options
  ragOptions: ragOptionsSchema.catch({
    chunkSize: 1000,
    thresholdTokens: 8192,
    minSimilarity: 0.0,
    limit: 10,
    excludePatterns: [],
    includePatterns: [],
  }),

  // MCP configuration
  mcp: z
    .object({
      servers: z.array(mcpServerConfigSchema).catch([]),
    })
    .catch({
      servers: [],
    }),

  // Chat options
  chatOptions: z
    .object({
      includeCurrentFileContent: z.boolean(),
      enableTools: z.boolean(),
      maxAutoIterations: z.number(),
    })
    .catch({
      includeCurrentFileContent: true,
      enableTools: true,
      maxAutoIterations: 1,
    }),
  
  // Continuation (续写) options
  continuationOptions: z
    .object({
      // whether to use current sidebar chat model
      useCurrentModel: z.boolean(),
      // fixed model id when not using current model
      fixedModelId: z.string(),
      // enable keyword trigger for continuation
      enableKeywordTrigger: z.boolean(),
      // the keyword to trigger continuation, default to double space
      triggerKeyword: z.string(),
    })
    .catch({
      useCurrentModel: true,
      fixedModelId:
        DEFAULT_CHAT_MODELS.find((v) => v.id === DEFAULT_APPLY_MODEL_ID)?.id ??
        DEFAULT_CHAT_MODELS[0].id,
      enableKeywordTrigger: true,
      triggerKeyword: '  ',
    }),
  
  // Assistant list
  assistants: z.array(assistantSchema).catch([]),
  
  // Currently selected assistant ID
  currentAssistantId: z.string().optional(),

  // Language setting
  language: z.enum(['en', 'zh']).catch('en'),
})
export type SmartComposerSettings = z.infer<typeof smartComposerSettingsSchema>

export type SettingMigration = {
  fromVersion: number
  toVersion: number
  migrate: (data: Record<string, unknown>) => Record<string, unknown>
}
