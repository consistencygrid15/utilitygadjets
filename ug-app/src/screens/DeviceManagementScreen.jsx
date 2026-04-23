import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDevices,
  addDevice,
  removeDevice,
  sendDeviceCommand,
} from '../redux/slices/deviceSlice';
import DeviceCard from '../components/DeviceCard';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingOverlay from '../components/LoadingOverlay';
import EmptyState from '../components/EmptyState';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/constants';

const DeviceManagementScreen = () => {
  const dispatch = useDispatch();
  const { items: devices, loading, commandLoading } = useSelector((s) => s.devices);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phoneNumber: '', deviceId: '', location: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchDevices());
  }, []);

  const validateForm = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Device name is required';
    if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
    else if (!/^\+?[0-9]{10,15}$/.test(form.phoneNumber.trim()))
      e.phoneNumber = 'Invalid phone number';
    if (!form.deviceId.trim()) e.deviceId = 'Device ID is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    const result = await dispatch(
      addDevice({
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        deviceId: form.deviceId.trim().toUpperCase(),
        location: form.location.trim(),
      })
    );

    if (addDevice.fulfilled.match(result)) {
      setShowModal(false);
      setForm({ name: '', phoneNumber: '', deviceId: '', location: '' });
    } else {
      Alert.alert('Error', result.payload || 'Failed to add device');
    }
  };

  const handleDelete = (device) => {
    Alert.alert(
      'Remove Device',
      `Remove "${device.name}" from your account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeDevice(device._id)),
        },
      ]
    );
  };

  const handleCommand = (device, command) => {
    Alert.alert(
      `${command} Device`,
      `Send ${command} command to "${device.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: command,
          style: command === 'PANIC' ? 'destructive' : 'default',
          onPress: () => dispatch(sendDeviceCommand({ id: device._id, command })),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.pageTitle}>My Devices</Text>
        <Button
          title="+ Add"
          onPress={() => setShowModal(true)}
          style={styles.addBtn}
          textStyle={styles.addBtnText}
        />
      </View>

      {loading && devices.length === 0 ? (
        <LoadingOverlay message="Loading devices..." />
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => dispatch(fetchDevices())}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              emoji="📡"
              title="No devices yet"
              subtitle="Tap '+ Add' to link your first GSM security device"
            />
          }
          renderItem={({ item }) => (
            <DeviceCard
              device={item}
              commandLoading={commandLoading}
              onArm={() => handleCommand(item, 'ARM')}
              onDisarm={() => handleCommand(item, 'DISARM')}
              onPanic={() => handleCommand(item, 'PANIC')}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Device Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>Add Device</Text>
            <Text style={styles.modalSubtitle}>
              Enter the details of your GSM security device
            </Text>

            <Input
              label="Device Name"
              placeholder="e.g. Main House Alarm"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              error={errors.name}
            />
            <Input
              label="Device Phone Number"
              placeholder="+919876543210"
              value={form.phoneNumber}
              onChangeText={(v) => setForm((f) => ({ ...f, phoneNumber: v }))}
              keyboardType="phone-pad"
              error={errors.phoneNumber}
            />
            <Input
              label="Device ID"
              placeholder="e.g. DEVICE123"
              value={form.deviceId}
              onChangeText={(v) => setForm((f) => ({ ...f, deviceId: v.toUpperCase() }))}
              autoCapitalize="characters"
              error={errors.deviceId}
            />
            <Input
              label="Location (Optional)"
              placeholder="e.g. Ground Floor"
              value={form.location}
              onChangeText={(v) => setForm((f) => ({ ...f, location: v }))}
            />

            <Button
              title="Add Device"
              onPress={handleAdd}
              loading={loading}
              style={styles.modalBtn}
            />
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setShowModal(false)}
              style={styles.modalCancelBtn}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  pageTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  addBtn: { paddingHorizontal: 0, minWidth: 70 },
  addBtnText: { fontSize: FONTS.sizes.sm },
  list: { paddingBottom: SPACING.xxl },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.md,
  },
  modalBtn: { marginTop: SPACING.sm },
  modalCancelBtn: { marginTop: SPACING.xs },
});

export default DeviceManagementScreen;
