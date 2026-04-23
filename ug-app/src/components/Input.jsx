import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/constants';

/**
 * Reusable Input component.
 *
 * Props:
 *   label           {string}
 *   placeholder     {string}
 *   value           {string}
 *   onChangeText    {function}
 *   error           {string}    Error message to display below input
 *   secureTextEntry {boolean}
 *   keyboardType    {string}
 *   autoCapitalize  {string}
 *   rightIcon       {ReactNode}
 *   onRightIconPress {function}
 *   style           {object}
 *   inputStyle      {object}
 *   editable        {boolean}
 */
const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  editable = true,
  multiline = false,
  numberOfLines,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError, !editable && styles.disabled]}>
        <TextInput
          style={[styles.input, multiline && styles.multiline, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  disabled: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    paddingVertical: 13,
    paddingHorizontal: SPACING.md,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  rightIcon: {
    paddingRight: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.xs,
    marginTop: 4,
    marginLeft: 2,
  },
});

export default Input;
