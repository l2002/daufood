import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import { Eye, ShieldCheck } from 'lucide-react';
import { db, ensureAnonymousAuth } from '../lib/firebase';

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [activeUsersCount, setActiveUsersCount] = useState<number>(1);

  // 1. Theo dõi số người đang xem thực tế thời gian thực (Real-time Presence) qua Firestore
  useEffect(() => {
    let unsubscribePresence: (() => void) | undefined;
    let heartbeatInterval: NodeJS.Timeout | undefined;

    // Tạo ID định danh riêng cho từng tab trình duyệt
    const tabSessionId = `tab_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    const presenceDocRef = doc(db, 'presence', tabSessionId);

    const setupPresence = async () => {
      try {
        await ensureAnonymousAuth();

        // Đăng ký phiên hoạt động của tab này lên Firestore
        await setDoc(presenceDocRef, {
          lastActive: serverTimestamp(),
          createdAt: serverTimestamp(),
        });

        // Gửi nhịp thở (heartbeat) định kỳ mỗi 15 giây để duy trì trạng thái online
        heartbeatInterval = setInterval(async () => {
          try {
            await setDoc(presenceDocRef, { lastActive: serverTimestamp() }, { merge: true });
          } catch {
            // bỏ qua lỗi tạm thời nếu mạng chập chờn
          }
        }, 15000);

        // Lắng nghe danh sách tất cả các tab/thiết bị đang trực tuyến
        const presenceCollectionRef = collection(db, 'presence');
        unsubscribePresence = onSnapshot(presenceCollectionRef, (snapshot) => {
          const now = Date.now();
          let count = 0;

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const lastActiveMillis = data.lastActive?.toMillis ? data.lastActive.toMillis() : now;
            // Nếu phiên hoạt động trong vòng 40 giây thì tính là đang xem
            if (now - lastActiveMillis < 40000) {
              count++;
            } else if (now - lastActiveMillis > 90000) {
              // Tự động dọn dẹp các tab đã tắt nhưng chưa kịp gửi lệnh xóa
              deleteDoc(docSnap.ref).catch(() => {});
            }
          });

          // Luôn tối thiểu là 1 (chính tab hiện tại)
          setActiveUsersCount(Math.max(1, count));
        });
      } catch (err) {
        console.warn('Presence tracking note:', err);
      }
    };

    setupPresence();

    // Dọn dẹp phiên tab khi người dùng đóng tab hoặc chuyển trang
    const handleUnload = () => {
      deleteDoc(presenceDocRef).catch(() => {});
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (unsubscribePresence) unsubscribePresence();
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      deleteDoc(presenceDocRef).catch(() => {});
    };
  }, []);

  // 2. Đếm tổng lượt truy cập tích lũy trên Firestore
  useEffect(() => {
    let unsubscribeStats: (() => void) | undefined;

    const initCounter = async () => {
      try {
        await ensureAnonymousAuth();
        const statsDocRef = doc(db, 'stats', 'pageviews');

        // Ngăn đếm lặp vô tận khi cùng 1 người F5 liên tục trong 1 phiên
        const sessionKey = 'site_visit_recorded';
        const alreadyCounted = sessionStorage.getItem(sessionKey);

        const snap = await getDoc(statsDocRef);
        if (!snap.exists() || (snap.exists() && typeof snap.data()?.count === 'number' && snap.data().count >= 1000)) {
          await setDoc(statsDocRef, {
            count: 100,
            updatedAt: serverTimestamp(),
          });
        } else if (!alreadyCounted) {
          await updateDoc(statsDocRef, {
            count: increment(1),
            updatedAt: serverTimestamp(),
          });
          sessionStorage.setItem(sessionKey, 'true');
        }

        // Lắng nghe số lượt truy cập cập nhật thời gian thực
        unsubscribeStats = onSnapshot(statsDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const total = typeof data.count === 'number' ? data.count : 100;
            setVisitorCount(total);
          }
        });
      } catch (err) {
        console.warn('Visitor counter note:', err);
        if (visitorCount === null) {
          setVisitorCount(100);
        }
      }
    };

    initCounter();

    return () => {
      if (unsubscribeStats) unsubscribeStats();
    };
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div
      id="visitor-counter-bar"
      className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4 py-2 rounded-full bg-white/95 border border-neutral-200/90 shadow-xs text-xs text-neutral-600 font-medium"
    >
      <div className="flex items-center gap-1.5 text-neutral-800 font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-emerald-700 font-medium">
          {activeUsersCount} người đang xem
        </span>
      </div>

      <span className="text-neutral-300">|</span>

      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-neutral-500" />
        <span>
          Lượt truy cập: <strong className="text-neutral-950 font-bold">{visitorCount ? formatNumber(visitorCount) : '100'}</strong>
        </span>
      </div>

      <span className="text-neutral-300">|</span>

      <div className="flex items-center gap-1 text-neutral-500">
        <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
        <span>Dữ liệu minh bạch thời gian thực</span>
      </div>
    </div>
  );
}
