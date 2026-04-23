import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlerts, markRead, markAllRead } from '../redux/slices/alertSlice';
import AlertItem from '../components/AlertItem';
import EmptyState from '../components/EmptyState';
import { COLORS, FONTS, SPACING } from '../utils/constants';

const AlertHistoryScreen = () => {
  const dispatch = useDispatch();
  const { items: alerts, loading, unreadCount } = useSelector((s) => s.alerts);

  const load = useCallback(() => {
    dispatch(fetchAlerts({ limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAlertPress = (alert) => {
    if (!alert.isRead) {
      dispatch(markRead(alert._id));
    }
  };

  const handleMarkAll = () => {
    dispatch(markAllRead());
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {unreadCount > 0 ? (
        <TouchableOpacity onPress={handleMarkAll} style={styles.markAllBtn}>
          <Text style={styles.markAllText}>✓ Mark all as read ({unreadCount})</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.allReadText}>All caught up ✅</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.headerBar}>
        <Text style={styles.pageTitle}>Alert History</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              emoji="✅"
              title="No alerts"
              subtitle="Your security system hasn't triggered any alerts yet"
            />
          ) : null
        }
        renderItem={({ item }) => (
          <AlertItem alert={item} onPress={() => handleAlertPress(item)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  pageTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontSize: FONTS.sizes.xs, fontWeight: '800' },
  list: { paddingBottom: SPACING.xxl },
  listHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  markAllBtn: {
    alignSelf: 'flex-end',
  },
  markAllText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  allReadText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    textAlign: 'right',
  },
});

export default AlertHistoryScreen;
