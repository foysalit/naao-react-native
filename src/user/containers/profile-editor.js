import React from "react";
import { omit } from 'lodash';
import { TouchableOpacity } from "react-native";
import { Text, View, Label, Item, Icon, Input, Button, Spinner, Thumbnail, ActionSheet } from "native-base";

import DefaultAvatar from '../../shared/images/profile.pic.png';
import coloredForm from "../../styles/colored-form";
import colors from "../../styles/colors";
import common from "../../styles/common";

import { RegistrationSchema } from "../../auth/data/api";
import { takePhoto } from "../../shared/helpers/image";

export class ProfileEditor extends React.Component {
    profileValidator = RegistrationSchema.pick('city', 'name', 'pic').newContext();

    state = {
        name: "",
        pic: null,
        city: null,
        errors: [],
        cityName: "",
        loading: false,
        focusedField: null,
    };

    componentDidMount() {
        if (this.props.profileData) {
            this.setState({ ...this.props.profileData });
        }
    };

    renderFieldError(field) {
        const error = this.profileValidator.keyErrorMessage(field);

        if (!error)
            return null;

        return (
            <Text style={[common.textDanger, common.pl15]}>
                {this.profileValidator.keyErrorMessage(field)}
            </Text>
        )
    };

    handleInput(field, text) {
        this.setState({ [field]: text });
    };

    openCityFinder = () => {
        const field = 'city',
            nameKey = `${field}Name`;

        this.props.navigation.navigate("CityFinderStack", {
            setCity: (city) => {
                this.handleInput(field, city);
                this.handleInput(nameKey, city.description);
            },
            selected: this.state[field]
        });
    };

    placeholderText(fieldName) {
        const placeholders = {
            'name': 'Full Name',
            'cityName': 'City of residence',
        };

        if (this.state.focusedField === fieldName)
            return "";

        return placeholders[fieldName];
    };

    showPictureOptions = () => {
        ActionSheet.show({
            options: ['Take Photo', 'Pick From Gallery', 'Cancel'],
            title: "Upload Profile Photo",
            cancelButtonIndex: 2,
        }, async (option) => {
            let pic;

            switch (option) {
                case 0:
                    pic = await takePhoto();
                    if (pic) this.handleInput('pic', pic);
                    break;

                case 1:
                    pic = await takePhoto(true);
                    if (pic) this.handleInput('pic', pic);
                    break;

                default:
                    break;
            }
        });
    };

    handleSubmit = () => {
        if (this.props.loading)
            return null;

        let account = this.profileValidator.clean(this.state);

        if (account.pic && account.pic.indexOf('http') === 0)
            account = omit(account, 'pic');

        this.profileValidator.validate(account);
        if (!this.profileValidator.isValid()) {
            this.setState({ errors: this.profileValidator.validationErrors() });
            return;
        }    

        this.props.onSubmit(this.state);
    };

    render() {
        const { pic, name, cityName } = this.state;
        const { loading, submitText } = this.props;

        return (
            <View>
                <View style={[common.py10, common.alignCenter]}>
                    <TouchableOpacity 
                        style={[ common.br50 ]} 
                        onPress={this.showPictureOptions}>
                        <Thumbnail 
                            large 
                            source={pic ? { uri: pic } : DefaultAvatar}
                        />
                    </TouchableOpacity>
                </View>
                {this.renderFieldError('pic')}

                <Label style={[coloredForm.label]}>NAME</Label>
                <Item
                    rounded
                    style={[coloredForm.item]}
                >
                    <Icon name="user" style={[coloredForm.itemIcon]} />
                    <Input
                        value={name}
                        autoCorrect={false}
                        returnKeyType="next"
                        autoCapitalize="words"
                        ref={ref => (this.name = ref)}
                        style={[coloredForm.input]}
                        placeholderTextColor={colors.primary}
                        placeholder={this.placeholderText("name")}
                        onSubmitEditing={() => this.cityName._root.focus()}
                        onChangeText={this.handleInput.bind(this, 'name')}
                        onFocus={() => this.setState({ focusedField: 'name' })}
                    />
                </Item>
                {this.renderFieldError('name')}

                <Label style={[coloredForm.label]}>CITY</Label>
                <Item
                    rounded
                    style={[coloredForm.item]}
                    onPress={this.openCityFinder}
                >
                    <Icon name="home" style={[coloredForm.itemIcon]} />
                    <Input
                        value={cityName}
                        editable={false}
                        autoCapitalize="words"
                        style={[coloredForm.input]}
                        onTouchStart={this.openCityFinder}
                        ref={ref => (this.cityName = ref)}
                        placeholderTextColor={colors.primary}
                        placeholder={this.placeholderText("cityName")}
                        onChangeText={this.handleInput.bind(this, 'cityName')}
                        onFocus={() => this.setState({ focusedField: 'cityName' })}
                    />
                </Item>
                {this.renderFieldError('city')}

                <Button
                    info
                    block
                    rounded
                    disabled={loading}
                    style={[common.mt25]}
                    onPress={this.handleSubmit}
                >
                    {loading
                        ? <Spinner color={colors.light} />
                        : <Text>{ submitText }</Text>
                    }
                </Button>
            </View>
        );
    };
};

export default ProfileEditor;