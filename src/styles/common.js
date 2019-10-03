import { StyleSheet } from "react-native";

import AppColors from './colors';

const styles = {
    alignCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexReverse: {
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    fontBold: {
        fontWeight: 'bold'
    },
    fontItalic: {
        fontStyle: 'italic'
    },
    textRight: {
        textAlign: 'right'
    },
    textCenter: {
        textAlign: 'center'
    },
    bgBackground: {
        backgroundColor: AppColors.background
    },
    textBackground: {
        color: AppColors.background
    },
    bgPrimary: {
        backgroundColor: AppColors.primary
    },
    textPrimary: {
        color: AppColors.primary
    },
    bgSuccess: {
        backgroundColor: AppColors.success
    },
    textSuccess: {
        color: AppColors.success
    },
    bgDanger: {
        backgroundColor: AppColors.danger
    },
    textDanger: {
        color: AppColors.danger
    },
    bgDark: {
        backgroundColor: AppColors.dark
    },
    textDark: {
        color: AppColors.dark
    },
    bgLight: {
        backgroundColor: AppColors.light
    },
    textLight: {
        color: AppColors.light
    },

    borderedSection: {
        borderBottomWidth: 2,
        borderBottomColor: AppColors.primary
    },

    // page headers
    pageHeaderGrid: {
        paddingVertical: 25,
        paddingRight: 5,
        paddingLeft: 10,
    },
    pageHeaderText: {
        fontSize: 25,
        paddingTop: 5,
        fontWeight: 'bold',
    },

    // card list 
    cardListInfoIcon: {
        color: AppColors.danger,
        fontSize: 18
    },
    cardListInfoText: {
        textAlign: 'right',
        fontWeight: 'bold',
        alignSelf: 'stretch',
    },
};

const numbers = Array.from(Array(11)).map((i, x) => x * 5);

numbers.forEach(i => {
    styles[`ml${i}`] = { marginLeft: i };
    styles[`mr${i}`] = { marginRight: i };
    styles[`mt${i}`] = { marginTop: i };
    styles[`mb${i}`] = { marginBottom: i };
    styles[`mx${i}`] = { marginHorizontal: i };
    styles[`my${i}`] = { marginVertical: i };

    styles[`px${i}`] = { paddingHorizontal: i };
    styles[`py${i}`] = { paddingVertical: i };
    styles[`pl${i}`] = { paddingLeft: i };
    styles[`pr${i}`] = { paddingRight: i };
    styles[`pt${i}`] = { paddingTop: i };
    styles[`pb${i}`] = { paddingBottom: i };

    styles[`br${i}`] = { borderRadius: i };
    styles[`btrr${i}`] = { borderTopRightRadius: i };
    styles[`bbrr${i}`] = { borderBottomRightRadius: i };
    styles[`btlr${i}`] = { borderTopLeftRadius: i };
    styles[`bblr${i}`] = { borderBottomLeftRadius: i };

    styles[`fs${i}`] = { fontSize: i };
});

// console.log(styles);

export default StyleSheet.create(styles);