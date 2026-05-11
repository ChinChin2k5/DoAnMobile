// Screens_Duy/Dashboard_Thi_Sinh.js
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, SafeAreaView, Animated, Modal, ScrollView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, query, onSnapshot, where } from 'firebase/firestore';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const DURATION_OPTIONS = [
  { label: 'Tất cả', value: null },
  { label: '< 15 phút', value: [0, 14] },
  { label: '15 – 30 phút', value: [15, 30] },
  { label: '> 30 phút', value: [31, 9999] },
];
const QUESTIONS_OPTIONS = [
  { label: 'Tất cả', value: null },
  { label: '< 10 câu', value: [0, 9] },
  { label: '10 – 20 câu', value: [10, 20] },
  { label: '> 20 câu', value: [21, 9999] },
];
const SORT_OPTIONS = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Cũ nhất', value: 'oldest' },
  { label: 'Nhiều câu nhất', value: 'most_q' },
  { label: 'Ít câu nhất', value: 'least_q' },
  { label: 'Dài nhất', value: 'longest' },
  { label: 'Ngắn nhất', value: 'shortest' },
];

// Filter mặc định — dùng để reset
const DEFAULT_FILTERS = {
  status: 'Tất cả',        // 'Tất cả' | 'active' | 'PRIVATE'
  duration: null,           // null | [min, max]
  totalQuestions: null,     // null | [min, max]
  allowRetake: null,        // null | true | false
  sort: 'newest',
};

// ─────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────
const SkeletonItem = ({ width, height, borderRadius = 4, style }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#cbd5e1', opacity }, style]} />;
};

const SkeletonCard = ({ i }) => (
  <View key={i} style={styles.examCard}>
    <SkeletonItem width="70%" height={20} style={{ marginBottom: 10 }} />
    <SkeletonItem width="40%" height={14} style={{ marginBottom: 15 }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <SkeletonItem width={80} height={30} borderRadius={20} />
      <SkeletonItem width={100} height={30} borderRadius={8} />
    </View>
  </View>
);

// ─────────────────────────────────────────────
// FILTER BOTTOM SHEET
// ─────────────────────────────────────────────
function FilterSheet({ visible, filters, onApply, onClose }) {
  // Draft state — chỉ apply khi bấm "Áp dụng"
  const [draft, setDraft] = useState(filters);
  useEffect(() => { if (visible) setDraft(filters); }, [visible]);

  const set = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  // Đếm số tiêu chí đang active trong draft
  const draftCount =
    (draft.status !== 'Tất cả' ? 1 : 0) +
    (draft.duration !== null ? 1 : 0) +
    (draft.totalQuestions !== null ? 1 : 0) +
    (draft.allowRetake !== null ? 1 : 0) +
    (draft.sort !== 'newest' ? 1 : 0);

  const Section = ({ title }) => (
    <Text style={fStyles.sectionTitle}>{title}</Text>
  );

  const ChipRow = ({ options, selectedVal, onSelect, labelKey = 'label', valKey = 'value' }) => (
    <View style={fStyles.chipRow}>
      {options.map((opt) => {
        const val = opt[valKey];
        const isActive = JSON.stringify(selectedVal) === JSON.stringify(val);
        return (
          <TouchableOpacity
            key={opt[labelKey]}
            style={[fStyles.chip, isActive && fStyles.chipActive]}
            onPress={() => onSelect(isActive ? (val === null ? null : DEFAULT_FILTERS[valKey]) : val)}
          >
            <Text style={[fStyles.chipText, isActive && fStyles.chipTextActive]}>
              {opt[labelKey]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={fStyles.overlay}>
        <TouchableOpacity style={fStyles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={fStyles.sheet}>
          {/* Handle bar */}
          <View style={fStyles.handle} />

          {/* Header */}
          <View style={fStyles.header}>
            <Text style={fStyles.title}>Bộ lọc nâng cao</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

            {/* ── TRẠNG THÁI ── */}
            <Section title="Trạng thái đề thi" />
            <ChipRow
              options={[
                { label: 'Tất cả', value: 'Tất cả' },
                { label: 'Sẵn sàng', value: 'active' },
                { label: 'Riêng tư', value: 'PRIVATE' },
              ]}
              selectedVal={draft.status}
              onSelect={(v) => set('status', v ?? 'Tất cả')}
            />

            {/* ── THỜI GIAN ── */}
            <Section title="Thời gian làm bài" />
            <ChipRow
              options={DURATION_OPTIONS}
              selectedVal={draft.duration}
              onSelect={(v) => set('duration', v)}
            />

            {/* ── SỐ CÂU HỎI ── */}
            <Section title="Số câu hỏi" />
            <ChipRow
              options={QUESTIONS_OPTIONS}
              selectedVal={draft.totalQuestions}
              onSelect={(v) => set('totalQuestions', v)}
            />

            {/* ── LÀM LẠI ── */}
            <Section title="Cho phép làm lại" />
            <View style={fStyles.chipRow}>
              {[
                { label: 'Tất cả', value: null },
                { label: 'Được làm lại', value: true },
                { label: 'Không làm lại', value: false },
              ].map((opt) => {
                const isActive = draft.allowRetake === opt.value;
                return (
                  <TouchableOpacity
                    key={String(opt.label)}
                    style={[fStyles.chip, isActive && fStyles.chipActive]}
                    onPress={() => set('allowRetake', opt.value)}
                  >
                    <Text style={[fStyles.chipText, isActive && fStyles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── SẮP XẾP ── */}
            <Section title="Sắp xếp theo" />
            <View style={fStyles.chipRow}>
              {SORT_OPTIONS.map((opt) => {
                const isActive = draft.sort === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[fStyles.chip, isActive && fStyles.chipActive]}
                    onPress={() => set('sort', opt.value)}
                  >
                    <Text style={[fStyles.chipText, isActive && fStyles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer buttons */}
          <View style={fStyles.footer}>
            <TouchableOpacity
              style={fStyles.resetBtn}
              onPress={() => setDraft(DEFAULT_FILTERS)}
            >
              <Ionicons name="refresh" size={16} color="#64748b" />
              <Text style={fStyles.resetText}>
                Đặt lại{draftCount > 0 ? ` (${draftCount})` : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={fStyles.applyBtn}
              onPress={() => { onApply(draft); onClose(); }}
            >
              <Text style={fStyles.applyText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// ACTIVE FILTER TAGS (hiển thị dưới search bar)
// ─────────────────────────────────────────────
function ActiveFilterTags({ filters, onRemove }) {
  const tags = [];

  if (filters.status !== 'Tất cả')
    tags.push({ key: 'status', label: filters.status === 'active' ? 'Sẵn sàng' : 'Riêng tư' });

  if (filters.duration !== null) {
    const opt = DURATION_OPTIONS.find(o => JSON.stringify(o.value) === JSON.stringify(filters.duration));
    if (opt) tags.push({ key: 'duration', label: `⏱ ${opt.label}` });
  }

  if (filters.totalQuestions !== null) {
    const opt = QUESTIONS_OPTIONS.find(o => JSON.stringify(o.value) === JSON.stringify(filters.totalQuestions));
    if (opt) tags.push({ key: 'totalQuestions', label: ` ${opt.label}` });
  }

  if (filters.allowRetake !== null)
    tags.push({ key: 'allowRetake', label: filters.allowRetake ? ' Được làm lại' : ' Không làm lại' });

  if (filters.sort !== 'newest') {
    const opt = SORT_OPTIONS.find(o => o.value === filters.sort);
    if (opt) tags.push({ key: 'sort', label: `↕ ${opt.label}` });
  }

  if (tags.length === 0) return null;

  return (
    // height cố định 40px → không bao giờ đẩy layout dù có bao nhiêu tag
    // alignItems center → chip căn giữa theo chiều dọc trong thanh
    <View style={styles.tagsRow}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsContent}
        alwaysBounceHorizontal={false}
      >
        {tags.map(tag => (
          <TouchableOpacity
            key={tag.key}
            style={styles.tag}
            onPress={() => onRemove(tag.key)}
          >
            <Text style={styles.tagText}>{tag.label}</Text>
            <Ionicons name="close" size={11} color="#3b82f6" style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        ))}

        {tags.length > 1 && (
          <>
            {/* Divider mỏng giữa chips và nút xóa tất cả */}
            <View style={styles.tagDivider} />
            <TouchableOpacity
              style={[styles.tag, styles.tagClearAll]}
              onPress={() => onRemove('__all__')}
            >
              <Ionicons name="close-circle" size={11} color="#ef4444" style={{ marginRight: 3 }} />
              <Text style={[styles.tagText, { color: '#ef4444' }]}>Xóa tất cả</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function Dashboard_Thi_Sinh({ navigation }) {
  const userContext = useContext(UserContext) || {};
  const userName = userContext.userName;
  const classCode = userContext.classCode || null;

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Số filter active (để hiện badge trên nút lọc)
  const activeFilterCount = useMemo(() => (
    (filters.status !== 'Tất cả' ? 1 : 0) +
    (filters.duration !== null ? 1 : 0) +
    (filters.totalQuestions !== null ? 1 : 0) +
    (filters.allowRetake !== null ? 1 : 0) +
    (filters.sort !== 'newest' ? 1 : 0)
  ), [filters]);

  // ── Fetch exams từ Firebase ──────────────────────────────────────────────────
  //Phục vụ cho việc lọc nâng cao
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) { setLoading(false); return; }
    const MIN_LOADING = 1000; // tối thiểu
    const MAX_LOADING = 5000; // safety net
    const startTime = Date.now();// đảm bảo loading ít nhất 1s để tránh flash khi mạng quá nhanh
    const timeout = setTimeout(() => setLoading(false), MAX_LOADING);
    setLoading(true);

    // Lấy TẤT CẢ exams, không filter status ở Firestore
    // Client sẽ tự lọc status + duration + totalQuestions + allowRetake
    const q = query(collection(db, 'exams'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() //phanh thây và liệt kê các cột dữ liệu để dễ dàng kiểm soát kiểu dữ liệu
      }));

      // Chỉ giữ exam thuộc về user này (theo uid ưu tiên, fallback creatorName)
      // hoặc exam được giao cho lớp của user
      const owned = list.filter(ex =>
        ex.creatorUid === uid ||
        (!ex.creatorUid && ex.creatorName === userName) ||
        (classCode && ex.targetClass === classCode)
      );
      //khi data về, nếu chưa đủ 1s thì delay thêm để đủ MIN_LOADING
      setExams(owned);
      const elapsed = Date.now() - startTime; // đã mất bao lâu?
      const remain = Math.max(0, MIN_LOADING - elapsed); // còn thiếu bao nhiêu?
      setTimeout(() => {
        setLoading(false);
        clearTimeout(timeout); // hủy safety net vì đã xử lý xong
      }, remain);
    }, (err) => {
      console.error('[Dashboard] Firestore error:', err.message);
      setLoading(false);
      clearTimeout(timeout);
    });

    return () => { unsubscribe(); clearTimeout(timeout); };
  }, [userName, classCode]);

  // ── Apply filters + sort + search (toàn bộ trên client) ──────────────────────
  const displayExams = useMemo(() => {
    let result = exams.filter(exam => {
      // 1. Tìm kiếm theo tên (không phân biệt hoa thường)
      if (searchQuery.trim()) {
        if (!exam.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()))
          return false;
      }

      // 2. Status — 'Tất cả' = bỏ qua, ngược lại so sánh chính xác
      //    Lưu ý: exam không có field status → coi là 'active'
      if (filters.status !== 'Tất cả') {
        const examStatus = exam.status ?? 'active';
        if (examStatus !== filters.status) return false;
      }

      // 3. Duration range — duration là số nguyên (phút)
      //    Firestore lưu: duration: 30 (int64)
      if (filters.duration !== null) {
        const [min, max] = filters.duration;
        const d = Number(exam.duration ?? 0);
        if (d < min || d > max) return false;
      }

      // 4. totalQuestions range — totalQuestions là số nguyên
      //    Firestore lưu: totalQuestions: 9 (int64)
      if (filters.totalQuestions !== null) {
        const [min, max] = filters.totalQuestions;
        const q = Number(exam.totalQuestions ?? 0);
        if (q < min || q > max) return false;
      }

      // 5. allowRetake — nằm trong config map: config.allowRetake (boolean)
      //    Nếu config không tồn tại → coi là false
      if (filters.allowRetake !== null) {
        const retake = exam.config?.allowRetake === true;
        if (retake !== filters.allowRetake) return false;
      }

      return true;
    });

    // 6. Sort
    result = [...result].sort((a, b) => {
      switch (filters.sort) {
        case 'oldest':
          return (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0);
        case 'most_q':
          return (Number(b.totalQuestions) || 0) - (Number(a.totalQuestions) || 0);
        case 'least_q':
          return (Number(a.totalQuestions) || 0) - (Number(b.totalQuestions) || 0);
        case 'longest':
          return (Number(b.duration) || 0) - (Number(a.duration) || 0);
        case 'shortest':
          return (Number(a.duration) || 0) - (Number(b.duration) || 0);
        case 'newest':
        default:
          return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);
      }
    });

    return result;
  }, [exams, searchQuery, filters]);

  // Reset về trang 1 khi filter / search thay đổi
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filters]);

  // Phân trang — đảm bảo không bao giờ âm hoặc NaN
  const totalPages = Math.max(1, Math.ceil(displayExams.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages); // tránh trang vượt quá tổng
  const paginatedExams = displayExams.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Xóa 1 filter tag
  const removeFilter = (key) => {
    if (key === '__all__') { setFilters(DEFAULT_FILTERS); return; }
    const defaults = { status: 'Tất cả', duration: null, totalQuestions: null, allowRetake: null, sort: 'newest' };
    setFilters(f => ({ ...f, [key]: defaults[key] }));
  };

  // ── Render exam card ─────────────────────────
  const renderExamCard = ({ item }) => {
    const createdDate = item.createdAt?.seconds
      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('vi-VN')
      : null;

    return (
      <TouchableOpacity
        style={styles.examCard}
        onPress={() => navigation.navigate('Man_Hinh_Lam_Bai', { examId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.examTitle} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.statusBadge, {
            backgroundColor: item.status === 'active' ? '#dcfce7' : '#f1f5f9'
          }]}>
            <Text style={[styles.statusText, {
              color: item.status === 'active' ? '#166534' : '#475569'
            }]}>
              {item.status === 'active' ? 'Sẵn sàng' : 'Riêng tư'}
            </Text>
          </View>
        </View>

        {item.description ? (
          <Text style={styles.examDesc} numberOfLines={2}>{item.description}</Text>
        ) : null}

        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={13} color="#64748b" />
            <Text style={styles.metaText}>{item.duration ?? '--'} phút</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="help-circle-outline" size={13} color="#64748b" />
            <Text style={styles.metaText}>{item.totalQuestions ?? '--'} câu</Text>
          </View>
          {item.config?.allowRetake && (
            <View style={styles.metaChip}>
              <Ionicons name="refresh-outline" size={13} color="#3b82f6" />
              <Text style={[styles.metaText, { color: '#3b82f6' }]}>Làm lại</Text>
            </View>
          )}
          {item.config?.shuffleQuestions && (
            <View style={styles.metaChip}>
              <Ionicons name="shuffle-outline" size={13} color="#7c3aed" />
              <Text style={[styles.metaText, { color: '#7c3aed' }]}>Ngẫu nhiên</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          {createdDate && (
            <Text style={styles.dateText}>{createdDate}</Text>
          )}
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => navigation.navigate('Man_Hinh_Lam_Bai', { examId: item.id })}
          >
            <Text style={styles.startBtnText}>Vào thi</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // ── RENDER ──────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào mừng,</Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate('Profile', { openNotif: true })}
        >
          <Ionicons name="notifications-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* SEARCH + FILTER BUTTON */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm đề thi..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Nút lọc với badge */}
        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons name="options-outline" size={20} color="white" />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ACTIVE FILTER TAGS */}
      <ActiveFilterTags filters={filters} onRemove={removeFilter} />

      {/* DANH SÁCH */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Đề thi ({displayExams.length})
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {activeFilterCount > 0 && (
              <TouchableOpacity onPress={() => setFilters(DEFAULT_FILTERS)}>
                <Text style={styles.clearFilterText}>Xóa lọc</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.createHeaderBtn}
              onPress={() => navigation.navigate('Tao_De_Thi_Part1')}
            >
              <Ionicons name="add" size={14} color="#3b82f6" />
              <Text style={styles.createHeaderBtnText}>Tạo đề</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} i={i} />)}
          </ScrollView>
        ) : displayExams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="funnel-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {activeFilterCount > 0 || searchQuery
                ? 'Không có đề thi nào khớp với bộ lọc.'
                : 'Bạn chưa có đề thi nào.'}
            </Text>
            {(activeFilterCount > 0 || searchQuery) ? (
              <TouchableOpacity
                style={styles.createNowBtn}
                onPress={() => { setFilters(DEFAULT_FILTERS); setSearchQuery(''); }}
              >
                <Text style={styles.createNowText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.createNowBtn}
                onPress={() => navigation.navigate('Tao_De_Thi_Part1')}
              >
                <Text style={styles.createNowText}>Tạo đề ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={paginatedExams}
            renderItem={renderExamCard}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => totalPages > 1 ? (
              <View style={styles.paginationWrapper}>
                <TouchableOpacity
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage(p => p - 1)}
                >
                  <Ionicons name="chevron-back" size={20}
                    color={currentPage === 1 ? '#cbd5e1' : '#3b82f6'} />
                </TouchableOpacity>

                <View style={styles.pageNumbersWrapper}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => setCurrentPage(num)}
                      style={[styles.numBtn, currentPage === num && styles.numBtnActive]}
                    >
                      <Text style={[styles.numBtnText, currentPage === num && styles.numBtnTextActive]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  disabled={currentPage === totalPages}
                  onPress={() => setCurrentPage(p => p + 1)}
                >
                  <Ionicons name="chevron-forward" size={20}
                    color={currentPage === totalPages ? '#cbd5e1' : '#3b82f6'} />
                </TouchableOpacity>
              </View>
            ) : null}
          />
        )}
      </View>

      {/* FILTER BOTTOM SHEET */}
      <FilterSheet
        visible={showFilter}
        filters={filters}
        onApply={setFilters}
        onClose={() => setShowFilter(false)}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 20, 
    backgroundColor: 'white',
  },
  welcomeText: { 
    fontSize: 14, 
    color: '#64748b' 
  },
  userNameText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1e293b' 
  },
  notifBtn: {
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    backgroundColor: '#f1f5f9',
    justifyContent: 'center', 
    alignItems: 'center',
  },

  // Search
  searchSection: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    marginVertical: 12, 
    gap: 10 
  },
  searchBar: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white',
    borderRadius: 12, 
    paddingHorizontal: 15, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    height: 46,
  },
  searchInput: { 
    flex: 1, 
    height: 46, 
    marginLeft: 10, 
    fontSize: 15 
  },
  filterBtn: {
    width: 46, 
    height: 46, 
    backgroundColor: '#3b82f6', 
    borderRadius: 12,
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative',
  },
  filterBtnActive: { 
    backgroundColor: '#1d4ed8' 
  },
  filterBadge: {
    position: 'absolute', 
    top: -5, 
    right: -5,
    backgroundColor: '#ef4444', 
    borderRadius: 9,
    width: 18, 
    height: 18, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1.5, 
    borderColor: '#f8fafc',
  },
  filterBadgeText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: '800' 
  },

  // Active filter tags — thanh ngang cố định chiều cao
  tagsRow: {
    height: 40,                        // cố định → không bao giờ đẩy layout
    justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: '#f1f5f9',
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
    backgroundColor: '#fafbff',
    marginBottom: 8,
  },
  tagsContent: {
    paddingHorizontal: 16,
    alignItems: 'center',              // chip căn giữa theo trục dọc
    gap: 6,
    flexDirection: 'row',
  },
  tag: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#eff6ff', 
    borderRadius: 20,
    paddingHorizontal: 10, 
    paddingVertical: 4, // nhỏ gọn hơn
    borderWidth: 1,
     borderColor: '#bfdbfe',
  },
  tagText: { 
    fontSize: 11, 
    color: '#3b82f6', 
    fontWeight: '700' 
  },
  tagDivider: {
    width: 1, 
    height: 18,
    backgroundColor: '#e2e8f0', 
    marginHorizontal: 4,
  },
  tagClearAll: { 
    backgroundColor: '#fff1f2', 
    borderColor: '#fecaca' 
  },

  // List
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    minHeight: 260,   // luôn có không gian tối thiểu dù có nhiều filter/header
    paddingBottom:'20%',
  },
  listHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: 12,
  },
  listTitle: { fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1e293b' 
  },
  clearFilterText: { 
    color: '#3b82f6', 
    fontWeight: '600', 
    fontSize: 13 
  },

  // Exam card
  examCard: {
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    marginBottom: 6,
  },
  examTitle: { fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    flex: 1, 
    marginRight: 8 
  },
  statusBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6 
  },
  statusText: { 
    fontSize: 11, 
    fontWeight: '700' 
  },
  examDesc: { 
    fontSize: 13, 
    color: '#64748b', 
    lineHeight: 19, 
    marginBottom: 10 
  },
  metaRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 6, 
    marginBottom: 12 
  },
  metaChip: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
    backgroundColor: '#f8fafc', 
    borderRadius: 8,
    paddingHorizontal: 8, 
    paddingVertical: 4,
    borderWidth: 1, 
    borderColor: '#e2e8f0',
  },
  metaText: { fontSize: 12, color: '#64748b' },
  cardFooter: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9', 
    paddingTop: 10,
  },
  dateText: { fontSize: 11, color: '#94a3b8' },
  startBtn: {
    backgroundColor: '#1e293b', 
    paddingHorizontal: 16,
    paddingVertical: 8, 
    borderRadius: 8,
  },
  startBtnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },

  // Empty state
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: {
    textAlign: 'center', 
    color: '#94a3b8',
    marginTop: 15, 
    paddingHorizontal: 40, 
    lineHeight: 22,
  },
  createNowBtn: {
    marginTop: 20, 
    backgroundColor: '#3b82f6',
    paddingHorizontal: 25, 
    paddingVertical: 12, 
    borderRadius: 10,
  },
  createNowText: { color: 'white', fontWeight: 'bold' },
  // Nút trong listHeader — tông xanh nhạt hoà với accent #3b82f6
  createHeaderBtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
    backgroundColor: '#eff6ff',
    borderWidth: 1, 
    borderColor: '#bfdbfe',
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 10,
  },
  createHeaderBtnText: { color: '#3b82f6', fontSize: 13, fontWeight: '700' },

  // Pagination
  paginationWrapper: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    paddingVertical: 20, 
    gap: 8,
  },
  pageNumbersWrapper: { flexDirection: 'row', gap: 6 },
  numBtn: {
    width: 34, 
    height: 34, 
    borderRadius: 8,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
  },
  numBtnActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  numBtnText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  numBtnTextActive: { color: 'white' },
});

// ─────────────────────────────────────────────
// FILTER SHEET STYLES
// ─────────────────────────────────────────────
const fStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#e2e8f0', 
    alignSelf: 'center', 
    marginTop: 12, 
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 14,
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9',
  },
  title: { 
    fontSize: 17, 
    fontWeight: '800', 
    color: '#1e293b' 
  },
  sectionTitle: {
    fontSize: 12, 
    fontWeight: '700', 
    color: '#64748b',
    letterSpacing: 0.5, 
    marginTop: 18, 
    marginBottom: 10, 
    paddingHorizontal: 20,
  },
  chipRow: {
    flexDirection: 'row', 
    flexWrap: 'wrap',
    paddingHorizontal: 20, 
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14, 
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5, 
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  chipActive: { 
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff' 
  },
  chipText: { 
    fontSize: 13, 
    color: '#64748b', 
    fontWeight: '600' 
  },
  chipTextActive: { 
    color: '#3b82f6', 
    fontWeight: '700' },
  footer: {
    flexDirection: 'row', 
    gap: 12, 
    paddingHorizontal: 20, 
    paddingTop: 16,
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9',
  },
  resetBtn: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 6, 
    paddingVertical: 13, 
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  resetText: { fontSize: 14, color: '#64748b', fontWeight: '700' },
  applyBtn: {
    flex: 2, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 13, 
    borderRadius: 12, 
    backgroundColor: '#3b82f6',
  },
  applyText: { fontSize: 15, color: 'white', fontWeight: '800' },
});