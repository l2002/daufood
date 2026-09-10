import { useState, useEffect, type FormEvent } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  increment,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { MessageSquare, Send, Heart, User, ShieldCheck, Clock } from 'lucide-react';
import { db, ensureAnonymousAuth, auth } from '../lib/firebase';
import { CommentItem } from '../types';

const ROLE_PRESETS = [
  'Sinh viên làm thêm',
  'Người lao động',
  'Đồng nghiệp cũ',
  'Cộng đồng hỗ trợ pháp lý',
  'Ẩn danh',
];

export function CommentsSection() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [roleBadge, setRoleBadge] = useState('Sinh viên làm thêm');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());

  // Subscribe to real-time comments from Firestore
  useEffect(() => {
    ensureAnonymousAuth();

    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: CommentItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let createdAtMs = Date.now();
          if (data.createdAt?.toMillis) {
            createdAtMs = data.createdAt.toMillis();
          } else if (typeof data.createdAt === 'number') {
            createdAtMs = data.createdAt;
          }

          return {
            id: docSnap.id,
            authorName: data.authorName || 'Ẩn danh',
            content: data.content || '',
            createdAt: createdAtMs,
            roleBadge: data.roleBadge || '',
            likes: data.likes || 0,
            likedBy: data.likedBy || [],
          };
        });

        setComments(list);
        setLoading(false);
      },
      (err) => {
        console.error('Lỗi khi tải bình luận:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await ensureAnonymousAuth();
      const finalName = authorName.trim() || 'Người dùng ẩn danh';

      await addDoc(collection(db, 'comments'), {
        authorName: finalName,
        roleBadge,
        content: content.trim(),
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });

      setContent('');
    } catch (err: any) {
      console.error('Lỗi gửi bình luận:', err);
      setSubmitError('Không thể gửi bình luận vào lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (likedCommentIds.has(commentId)) return;

    try {
      const user = await ensureAnonymousAuth();
      const uid = user?.uid || 'guest';

      const commentDocRef = doc(db, 'comments', commentId);
      await updateDoc(commentDocRef, {
        likes: increment(1),
        likedBy: arrayUnion(uid),
      });

      setLikedCommentIds((prev) => new Set(prev).add(commentId));
    } catch (err) {
      console.error('Lỗi khi thích bình luận:', err);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section
      id="community-comments-section"
      className="mt-14 sm:mt-16 bg-white rounded-2xl p-5 sm:p-8 md:p-10 border border-neutral-200/90 shadow-sm transition-shadow duration-300"
    >
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neutral-900 text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
              Bình luận & Đánh giá cộng đồng
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Chia sẻ ý kiến, kinh nghiệm và cùng bảo vệ quyền lợi chính đáng của người lao động & sinh viên
            </p>
          </div>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
          {comments.length} bình luận
        </span>
      </div>

      {/* Khung gửi bình luận */}
      <form onSubmit={handleSubmit} className="mb-10 bg-neutral-50/80 rounded-xl p-4 sm:p-6 border border-neutral-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Tên hoặc biệt danh của bạn
            </label>
            <div className="relative">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ví dụ: Sinh viên làm thêm, Minh, hoặc để trống ẩn danh"
                maxLength={60}
                className="w-full text-sm bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition-all"
              />
              <User className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Vai trò / Nhãn
            </label>
            <select
              value={roleBadge}
              onChange={(e) => setRoleBadge(e.target.value)}
              className="w-full text-sm bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition-all cursor-pointer"
            >
              {ROLE_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Nội dung bình luận / Đóng góp ý kiến
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung chia sẻ, kinh nghiệm giải quyết tranh chấp hoặc động viên..."
            maxLength={1000}
            className="w-full text-sm bg-white border border-neutral-300 rounded-lg p-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition-all resize-y min-h-[80px]"
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-[11px] text-neutral-400">
              Dữ liệu được lưu trữ trên Firebase Cloud an toàn
            </span>
            <span className="text-[11px] text-neutral-400">
              {content.length}/1000 ký tự
            </span>
          </div>
        </div>

        {submitError && (
          <div className="text-xs text-red-600 mb-3 bg-red-50 p-2.5 rounded-lg border border-red-200">
            {submitError}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-medium text-sm shadow-xs hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}</span>
          </button>
        </div>
      </form>

      {/* Danh sách bình luận */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-neutral-400">
            <div className="w-7 h-7 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin mb-3" />
            <span className="text-xs">Đang tải danh sách bình luận từ đám mây...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-10 text-center bg-neutral-50/60 rounded-xl border border-dashed border-neutral-200 p-6">
            <ShieldCheck className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700 mb-1">
              Chưa có bình luận nào
            </p>
            <p className="text-xs text-neutral-500">
              Hãy là người đầu tiên để lại ý kiến và cùng lan tỏa tinh thần bảo vệ người lao động!
            </p>
          </div>
        ) : (
          comments.map((item) => {
            const hasLiked = likedCommentIds.has(item.id);
            return (
              <article
                key={item.id}
                className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200/70 hover:border-neutral-300 transition-all duration-200 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-neutral-900">
                      {item.authorName}
                    </span>
                    {item.roleBadge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                        {item.roleBadge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400 text-xs shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimestamp(item.createdAt)}</span>
                  </div>
                </div>

                <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line mb-3">
                  {item.content}
                </p>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    disabled={hasLiked}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      hasLiked
                        ? 'bg-rose-50 text-rose-600 border-rose-200 font-semibold'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        hasLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                      }`}
                    />
                    <span>{item.likes ?? 0}</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
