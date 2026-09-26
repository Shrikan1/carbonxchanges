import { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheckCircle, FiInfo } from 'react-icons/fi';
import * as notificationApi from '../../api/endpoint/notificationApi';
import { useAuthStore } from '../../store/useAuthStore';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    try {
      const { data } = await notificationApi.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }

  async function handleMarkAsRead(id) {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        title="Notifications"
      >
        <FiBell className="w-4 h-4 sm:w-5 sm:h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] sm:text-[10px] font-bold shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-12 sm:right-0 mt-2 w-[90vw] max-w-[340px] sm:w-96 sm:max-w-none bg-white rounded-2xl shadow-xl border border-gray-100 z-[100] overflow-hidden flex flex-col max-h-[80vh]">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                <FiCheckCircle className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                    onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notification.is_read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        <FiInfo className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className={`text-sm font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${!notification.is_read ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="shrink-0 self-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
