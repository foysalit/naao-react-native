import { StyleSheet } from "react-native";

import ThemeColors from '../../native-base-theme/variables/platform';
import AppColors from './colors';
import Common from './common';

export const form = {
    ...Common.px15, ...Common.py15,
    backgroundColor: AppColors.background,
};

export const label = {
    ...Common.fontBold, 
    ...Common.pb10, 
    ...Common.pl5, 
    ...Common.mt20,
    color: ThemeColors.inverseTextColor,
    fontSize: 14,
};

export const item = {
    borderColor: AppColors.light,
    overflow: "hidden",
};

export const inlineItem = {
    flex: 1,
};

export const itemIcon = {
    color: AppColors.danger,
    fontSize: 18,
    ...Common.ml10,
};

export const input = {
    color: ThemeColors.inverseTextColor,
    ...Common.pr10,
    ...Common.pl10,
};

export const segment = {
    width: '100%',
    backgroundColor: 'transparent',
};

export const segmentText = {
    color: ThemeColors.inverseTextColor,
};

export const inputNote = {
    ...Common.py15,
    ...Common.px20,
    ...Common.primary,
    color: '#FFFFFF',
    overflow: 'hidden',
    borderTopRightRadius: 45,
    borderBottomRightRadius: 45,
    backgroundColor: AppColors.info,
};

export const segmentButton = {
    width: '50%',
    height: 45,
    ...Common.alignCenter,
    ...Common.textCenter,
    borderColor: AppColors.light,
};

export const segmentButtonFirst = {
    borderRightWidth: 0,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 0,
};

export const segmentButtonLast = {
    borderRightWidth: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 45,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 45,
};

export const submit = {
    ...Common.pt10,
    ...Common.flexReverse,
};

export default StyleSheet.create({
    form,
    label,
    item,
    inlineItem,
    itemIcon,
    input,
    segment,
    segmentText,
    inputNote,
    segmentButton,
    segmentButtonFirst,
    segmentButtonLast,
    submit,
});