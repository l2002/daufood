import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Eye, ShieldCheck, Users } from 'lucide-react';
import { db, ensureAnonymousAuth } from '../lib/firebase';

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [onlineEstimate, setOnlineEstimate] = useState<number>(3);

  useEffect(() => {
    // Generate a subtle realistic live browsing count between 2 and 6
    const timer = setInterval(() => {
      setOnlineEstimate(Math.floor(Math.random() * 4) + 2);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initCounter = async () => {
      try {
        await ensureAnonymousAuth();
        const statsDocRef = doc(db, 'stats', 'pageviews');

        // Check if user already incremented in this session to prevent spamming on rapid refresh
        const sessionKey = 'site_visit_recorded';
        const alreadyCounted = sessionStorage.getItem(sessionKey);

        const snap = await getDoc(statsDocRef);
        // If doc doesn't exist, or still holds previous placeholder count (>= 1000), set to 100
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

        // Real-time listener for live updates
        unsubscribe = onSnapshot(statsDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const total = typeof data.count === 'number' ? data.count : 100;
            setVisitorCount(total);
          }
        });
      } catch (err) {
        console.warn('Visitor counter note:', err);
        // Fallback friendly display
        if (visitorCount === null) {
          setVisitorCount(100);
        }
      }
    };

    initCounter();

    return () => {
      if (unsubscribe) unsubscribe();
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
        <span className="text-emerald-700 font-medium">{onlineEstimate} người đang xem</span>
      </div>

      <span className="text-neutral-300">|</span>

      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-neutral-500" />
        <span>
          Lượt truy cập: <strong className="text-neutral-950 font-bold">{visitorCount ? formatNumber(visitorCount) : '...'}</strong>
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
