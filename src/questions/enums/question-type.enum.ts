import { registerEnumType } from '@nestjs/graphql';

export enum QuestionType {
  Single = 'single',
  Multiple = 'multiple',
  Sorting = 'sorting',
  PlainText = 'plainText',
}

registerEnumType(QuestionType, {
  name: 'QuestionType',
});
