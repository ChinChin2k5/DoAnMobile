import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ item }) {
  return (
    <View style={[styles.card, item.isDark && styles.cardDark]}>
      <View style={styles.cardHeaderRow}>
        <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>{item.icon}</View>
        {item.badge.type !== 'online' ? (
          <View style={[styles.badgeGlow, styles[`badgeGlow_${item.badge.type}`]]}>
            <View style={[styles.badgeWrapper, styles[`badgeWrapper_${item.badge.type}`]]}>
              <Text style={[styles.badgeText, styles[`badgeText_${item.badge.type}`]]}>{item.badge.text}</Text>
            </View>
          </View>
        ) : (<View style={styles.onlineBadge} />)}
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, item.isDark && styles.cardTitleDark]}>{item.title}</Text>
        <Text style={[styles.cardValue, item.isDark && styles.cardValueDark]}>{item.value}</Text>
      </View>
    </View>
  );
}

// Chuyển toàn bộ Style của thẻ Thống kê sang đây
const styles = StyleSheet.create({
  card: { width: "100%", backgroundColor: "#FFFFFF", padding: 20, marginBottom: 20, borderRadius: 16, shadowColor: "#1A2134", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 4 },
  cardDark: { backgroundColor: '#0A1128' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconWrapper: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardContent: { alignItems: "flex-start" },
  cardTitle: { fontSize: 13, fontFamily: "Inter-SemiBold", color: "#6F7F91", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  cardValue: { fontSize: 32, fontFamily: "Inter-Black", color: "#1A2134" },
  cardTitleDark: { color: '#9CA3AF' }, cardValueDark: { color: '#FFFFFF' },
  badgeGlow: { borderRadius: 100, padding: 3 },
  badgeGlow_success: { shadowColor: "#10B981", shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  badgeGlow_primary: { shadowColor: "#084CCB", shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  badgeGlow_warning: { shadowColor: "#F59E0B", shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  badgeWrapper: { borderRadius: 100, paddingVertical: 4, paddingHorizontal: 12 },
  badgeWrapper_success: { backgroundColor: '#ECFDF5' }, badgeWrapper_primary: { backgroundColor: '#E8EFFB' }, badgeWrapper_warning: { backgroundColor: '#FEF3C7' },
  badgeText: { fontSize: 12, fontFamily: "Inter-SemiBold" },
  badgeText_success: { color: '#10B981' }, badgeText_primary: { color: '#084CCB' }, badgeText_warning: { color: '#B45309' },
  onlineBadge: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', marginRight: 6, shadowColor: "#10B981", shadowOpacity: 0.6, shadowRadius: 6, elevation: 4 },
});