import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  LayoutDashboard, 
  FileEdit, 
  UtensilsCrossed, 
  ShoppingBag, 
  Calendar, 
  Sparkles, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Database, 
  Network, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Save, 
  Eye, 
  MessageCircle, 
  Copy, 
  Check,
  UploadCloud,
  RefreshCw,
  FolderOpen,
  Tag,
  Filter,
  Search,
  X,
  ExternalLink,
  Shield,
  ArrowRight
} from 'lucide-react';
import { 
  BusinessSettings, 
  MenuItem, 
  Order, 
  AppointmentBooking, 
  EventItem, 
  GalleryItem, 
  ContactEnquiry, 
  AuditLogEntry, 
  SalonService, 
  StaffProfile,
  Currency,
  MenuSection,
  WebsiteImageRecord,
  MediaLibraryItem,
  MediaCategory,
  AdminRole
} from '../types';
import { StorageService } from '../services/storage';
import { SupabaseService } from '../services/supabase';
import { INITIAL_SECTION_IMAGE_RECORDS } from '../data/initialData';
import { SUPABASE_SQL_MIGRATION, FUTURE_BMS_INTEGRATION_SPEC } from '../data/supabaseSchema';
import { AppImage, normalizeImagePath } from '../components/AppImage';

interface AdminDashboardProps {
  settings: BusinessSettings;
  setSettings: (settings: BusinessSettings) => void;
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  bookings: AppointmentBooking[];
  setBookings: (bookings: AppointmentBooking[]) => void;
  events: EventItem[];
  setEvents: (events: EventItem[]) => void;
  gallery: GalleryItem[];
  setGallery: (gallery: GalleryItem[]) => void;
  services: SalonService[];
  setServices: (services: SalonService[]) => void;
  staff: StaffProfile[];
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  setSettings,
  menuItems,
  setMenuItems,
  orders,
  setOrders,
  bookings,
  setBookings,
  events,
  setEvents,
  gallery,
  setGallery,
  services,
  setServices,
  staff,
  onExit,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(StorageService.isAdminLoggedIn());
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState<'Super Administrator' | 'Content Editor' | 'Orders Staff'>('Super Administrator');

  // Active module tab
  const [activeModule, setActiveModule] = useState<string>('overview');

  // Copy helper
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase live health status
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ connected: boolean; message: string; timestamp?: string } | null>(null);

  const testSupabaseConnection = async () => {
    setIsTestingSupabase(true);
    const result = await SupabaseService.checkConnection();
    setSupabaseStatus(result);
    setIsTestingSupabase(false);
    if (result.connected) {
      showBanner('Supabase connection verified successfully!');
    }
  };

  // Status message
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const showBanner = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master passcodes: "bottega2026" or "admin" or "monrovia"
    if (passcode.toLowerCase() === 'bottega2026' || passcode.toLowerCase() === 'admin' || passcode.toLowerCase() === 'monrovia') {
      setIsAuthenticated(true);
      StorageService.setAdminLoggedIn(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid administrator credentials. (Default demo PIN: bottega2026)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    StorageService.setAdminLoggedIn(false);
  };

  // ================= MODULE STATES & HANDLERS =================
  // 1. Settings state
  const [formSettings, setFormSettings] = useState<BusinessSettings>(settings);

  const handleSaveSettings = () => {
    StorageService.saveSettings(formSettings, adminRole);
    setSettings(formSettings);
    showBanner('Website & Contact settings successfully updated.');
  };

  // 2. Menu Item Modal / Editor
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    section: 'restaurant',
    category: 'Local Specialties',
    price: 10,
    currency: 'USD',
    isAvailable: true,
    isFeatured: false,
    variants: [],
  });

  const handleSaveMenuItem = () => {
    if (!editingMenuItem) return;
    const sanitized = {
      ...editingMenuItem,
      image: editingMenuItem.image ? normalizeImagePath(editingMenuItem.image) : undefined
    };
    StorageService.updateMenuItem(editingMenuItem.id, sanitized, adminRole);
    setMenuItems(StorageService.getMenuItems());
    setEditingMenuItem(null);
    showBanner(`Updated menu item: "${editingMenuItem.name}".`);
  };

  const handleCreateMenuItem = () => {
    if (!newItem.name) return;
    StorageService.addMenuItem({
      name: newItem.name || 'New Item',
      description: newItem.description || '',
      section: newItem.section || 'restaurant',
      category: newItem.category || 'General',
      price: Number(newItem.price) || 0,
      currency: newItem.currency || 'USD',
      image: newItem.image ? normalizeImagePath(newItem.image) : undefined,
      isAvailable: newItem.isAvailable !== undefined ? newItem.isAvailable : true,
      isFeatured: !!newItem.isFeatured,
      variants: newItem.variants || [],
    }, adminRole);
    setMenuItems(StorageService.getMenuItems());
    setIsAddingMenuItem(false);
    setNewItem({
      name: '',
      description: '',
      section: 'restaurant',
      category: 'Local Specialties',
      price: 10,
      currency: 'USD',
      isAvailable: true,
      isFeatured: false,
      variants: [],
    });
    showBanner('New menu item successfully added to catalogue.');
  };

  const handleDeleteMenuItem = (id: string) => {
    if (confirm('Are you sure you want to remove this menu item?')) {
      StorageService.deleteMenuItem(id, adminRole);
      setMenuItems(StorageService.getMenuItems());
      showBanner('Item removed from menu.');
    }
  };

  // 3. Orders Status updater
  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    StorageService.updateOrderStatus(orderId, newStatus, adminRole);
    setOrders(StorageService.getOrders());
    showBanner(`Order status changed to "${newStatus}".`);
  };

  // 4. Bookings Status updater
  const handleBookingStatusChange = (bookingId: string, newStatus: AppointmentBooking['status']) => {
    StorageService.updateBookingStatus(bookingId, newStatus, adminRole);
    setBookings(StorageService.getBookings());
    showBanner(`Booking request status updated to "${newStatus}".`);
  };

  // 5. Events Manager
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({
    title: '',
    description: '',
    date: 'Upcoming Weekend',
    startTime: '8:00 PM',
    location: 'Bottega Restro & Lounge',
    ticketInfo: 'Free Entry',
    isPublished: true,
    isArchived: false,
    tag: 'Special Event',
    image: '/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37__6__2f1053fa.jpeg'
  });

  const handleCreateEvent = () => {
    if (!newEvent.title) return;
    StorageService.addEvent({
      title: newEvent.title || 'New Event',
      description: newEvent.description || '',
      date: newEvent.date || 'Upcoming',
      startTime: newEvent.startTime || '8:00 PM',
      endTime: newEvent.endTime,
      location: newEvent.location || 'Bottega Lounge',
      ticketInfo: newEvent.ticketInfo || 'Open to all',
      isPublished: true,
      isArchived: false,
      tag: newEvent.tag || 'Special',
      image: newEvent.image || '/public/assets/aistudio/WhatsApp_Image_2026-10-31_at_10.14.37__6__2f1053fa.jpeg'
    }, adminRole);
    setEvents(StorageService.getEvents());
    setIsAddingEvent(false);
    showBanner('Event published successfully.');
  };

  const handleToggleEventPublish = (event: EventItem) => {
    StorageService.updateEvent(event.id, { isPublished: !event.isPublished }, adminRole);
    setEvents(StorageService.getEvents());
    showBanner(`Event ${event.isPublished ? 'unpublished' : 'published'}.`);
  };

  const handleToggleEventArchive = (event: EventItem) => {
    StorageService.updateEvent(event.id, { isArchived: !event.isArchived }, adminRole);
    setEvents(StorageService.getEvents());
    showBanner(`Event ${event.isArchived ? 'restored to active' : 'moved to archive'}.`);
  };

  // 6. Gallery Manager
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCat, setNewGalleryCat] = useState<GalleryItem['category']>('restaurant');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  const handleAddGalleryItem = () => {
    if (!newGalleryTitle.trim() || !newGalleryUrl.trim()) return;
    StorageService.addGalleryItem({
      title: newGalleryTitle.trim(),
      category: newGalleryCat,
      image: normalizeImagePath(newGalleryUrl.trim()),
      caption: newGalleryCaption.trim() || undefined,
      isFeatured: true,
    }, adminRole);
    setGallery(StorageService.getGallery());
    setNewGalleryTitle('');
    setNewGalleryUrl('');
    setNewGalleryCaption('');
    showBanner('New photo added to gallery.');
  };

  const handleDeleteGallery = (id: string) => {
    StorageService.deleteGalleryItem(id, adminRole);
    setGallery(StorageService.getGallery());
    showBanner('Media item deleted.');
  };

  // 7. Enquiries
  const enquiries = StorageService.getEnquiries();

  // ================= 8. WEBSITE SECTION IMAGES & MEDIA LIBRARY =================
  const [sectionImages, setSectionImages] = useState<WebsiteImageRecord[]>(StorageService.getSectionImages());
  const [mediaLibrary, setMediaLibrary] = useState<MediaLibraryItem[]>(StorageService.getMediaLibrary());
  const [activeImagePageTab, setActiveImagePageTab] = useState<'Homepage' | 'Order Online' | 'Salon & Masseuse' | 'Gallery' | 'Events & Lounge' | 'Contact Us' | 'Brand'>('Homepage');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<'all' | MediaCategory>('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');

  // Section Image Replacement Modal
  const [replacingRecord, setReplacingRecord] = useState<WebsiteImageRecord | null>(null);
  const [replacementSource, setReplacementSource] = useState<'upload' | 'library'>('upload');
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [replacementPreviewUrl, setReplacementPreviewUrl] = useState<string | null>(null);
  const [replacementAlt, setReplacementAlt] = useState('');
  const [replacementCaption, setReplacementCaption] = useState('');
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replacementError, setReplacementError] = useState<string | null>(null);

  // Upload Media Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newMediaFile, setNewMediaFile] = useState<File | null>(null);
  const [newMediaPreviewUrl, setNewMediaPreviewUrl] = useState<string | null>(null);
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<MediaCategory>('homepage');
  const [newMediaAlt, setNewMediaAlt] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Edit Media Metadata Modal
  const [editingMedia, setEditingMedia] = useState<MediaLibraryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editCategory, setEditCategory] = useState<MediaCategory>('homepage');

  // Assign Media Modal
  const [assigningMedia, setAssigningMedia] = useState<MediaLibraryItem | null>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowed.includes(file.type.toLowerCase())) {
      return { valid: false, error: 'Only JPG, PNG, WEBP, or AVIF image files are supported.' };
    }
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      return { valid: false, error: `File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose an image under 5MB.` };
    }
    return { valid: true };
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Open replace modal
  const handleOpenReplaceModal = (record: WebsiteImageRecord) => {
    setReplacingRecord(record);
    setReplacementSource('upload');
    setReplacementFile(null);
    setReplacementPreviewUrl(null);
    setReplacementAlt(record.altText || '');
    setReplacementCaption(record.caption || '');
    setSelectedLibraryId(null);
    setReplacementError(null);
  };

  const handleFileSelectForReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const val = validateFile(file);
    if (!val.valid) {
      setReplacementError(val.error || 'Invalid file');
      return;
    }
    setReplacementError(null);
    setReplacementFile(file);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setReplacementPreviewUrl(dataUrl);
    } catch {
      setReplacementError('Unable to read selected image file.');
    }
  };

  const handleConfirmReplacement = async () => {
    if (!replacingRecord) return;
    setIsReplacing(true);
    setReplacementError(null);

    try {
      let finalUrl = '';
      if (replacementSource === 'upload') {
        if (!replacementFile && !replacementPreviewUrl) {
          setReplacementError('Please select an image file to upload.');
          setIsReplacing(false);
          return;
        }

        // Try Supabase Storage upload
        if (replacementFile) {
          const res = await SupabaseService.uploadStorageImage(replacingRecord.category, replacementFile, replacementFile.name);
          if (res.success && res.url) {
            finalUrl = res.url;
          } else {
            // Safe fallback to data URL
            finalUrl = replacementPreviewUrl || '';
          }
        } else {
          finalUrl = replacementPreviewUrl || '';
        }
      } else {
        // From Media Library
        if (!selectedLibraryId) {
          setReplacementError('Please select an image from the library.');
          setIsReplacing(false);
          return;
        }
        const item = mediaLibrary.find(m => m.id === selectedLibraryId);
        if (!item) {
          setReplacementError('Selected media item not found.');
          setIsReplacing(false);
          return;
        }
        finalUrl = item.url;
      }

      if (!finalUrl) {
        setReplacementError('Image URL could not be resolved.');
        setIsReplacing(false);
        return;
      }

      // Update Section Image safely
      const updated = StorageService.updateSectionImage(replacingRecord.id, {
        url: finalUrl,
        altText: replacementAlt.trim() || replacingRecord.altText,
        caption: replacementCaption.trim() || undefined,
      }, adminRole);

      if (updated) {
        // Also add or update in Media Library if it was an upload
        if (replacementSource === 'upload' && replacementFile) {
          StorageService.addMediaLibraryItem({
            fileName: replacementFile.name,
            url: finalUrl,
            category: replacingRecord.category,
            altText: replacementAlt.trim() || replacingRecord.altText,
            caption: replacementCaption.trim() || undefined,
            fileSize: `${(replacementFile.size / 1024).toFixed(0)} KB`,
            mimeType: replacementFile.type,
            usedIn: [replacingRecord.sectionLabel],
          }, adminRole);
        } else if (selectedLibraryId) {
          // Add sectionLabel to usedIn
          const libItem = mediaLibrary.find(m => m.id === selectedLibraryId);
          if (libItem && !libItem.usedIn.includes(replacingRecord.sectionLabel)) {
            StorageService.updateMediaLibraryItem(libItem.id, {
              usedIn: [...libItem.usedIn, replacingRecord.sectionLabel]
            }, adminRole);
          }
        }

        // Refresh state
        setSectionImages(StorageService.getSectionImages());
        setMediaLibrary(StorageService.getMediaLibrary());
        const updatedSettings = StorageService.getSettings();
        setSettings(updatedSettings);
        setFormSettings(updatedSettings);

        showBanner(`Successfully replaced image for "${replacingRecord.sectionLabel}". Live website updated.`);
        setReplacingRecord(null);
      }
    } catch (err: any) {
      setReplacementError(err.message || 'An error occurred during replacement.');
    } finally {
      setIsReplacing(false);
    }
  };

  const handleResetSectionImage = (record: WebsiteImageRecord) => {
    const original = INITIAL_SECTION_IMAGE_RECORDS.find(r => r.key === record.key);
    if (!original) return;
    if (confirm(`Reset "${record.sectionLabel}" to its default original photograph?`)) {
      StorageService.updateSectionImage(record.id, {
        url: original.url,
        altText: original.altText,
        caption: original.caption,
      }, adminRole);
      setSectionImages(StorageService.getSectionImages());
      const updatedSettings = StorageService.getSettings();
      setSettings(updatedSettings);
      setFormSettings(updatedSettings);
      showBanner(`Reset image for "${record.sectionLabel}" to original defaults.`);
    }
  };

  // Media Library Upload Modal handlers
  const handleOpenUploadMediaModal = () => {
    setIsUploadModalOpen(true);
    setNewMediaFile(null);
    setNewMediaPreviewUrl(null);
    setNewMediaTitle('');
    setNewMediaCategory('homepage');
    setNewMediaAlt('');
    setNewMediaCaption('');
    setUploadError(null);
  };

  const handleFileSelectForUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const val = validateFile(file);
    if (!val.valid) {
      setUploadError(val.error || 'Invalid file');
      return;
    }
    setUploadError(null);
    setNewMediaFile(file);
    if (!newMediaTitle) {
      setNewMediaTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setNewMediaPreviewUrl(dataUrl);
    } catch {
      setUploadError('Unable to preview selected image file.');
    }
  };

  const handleConfirmUploadMedia = async () => {
    if (!newMediaFile || !newMediaPreviewUrl) {
      setUploadError('Please select a file to upload.');
      return;
    }
    setIsUploadingMedia(true);
    setUploadError(null);

    try {
      let finalUrl = '';
      const res = await SupabaseService.uploadStorageImage(newMediaCategory, newMediaFile, newMediaFile.name);
      if (res.success && res.url) {
        finalUrl = res.url;
      } else {
        finalUrl = newMediaPreviewUrl;
      }

      StorageService.addMediaLibraryItem({
        fileName: newMediaFile.name,
        url: finalUrl,
        category: newMediaCategory,
        altText: newMediaAlt.trim() || newMediaTitle.trim(),
        caption: newMediaCaption.trim() || undefined,
        fileSize: `${(newMediaFile.size / 1024).toFixed(0)} KB`,
        mimeType: newMediaFile.type,
        usedIn: [],
      }, adminRole);

      setMediaLibrary(StorageService.getMediaLibrary());
      setIsUploadModalOpen(false);
      showBanner(`File "${newMediaFile.name}" successfully added to media library.`);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleOpenEditMedia = (item: MediaLibraryItem) => {
    setEditingMedia(item);
    setEditTitle(item.fileName);
    setEditAlt(item.altText || '');
    setEditCaption(item.caption || '');
    setEditCategory(item.category);
  };

  const handleSaveMediaMetadata = () => {
    if (!editingMedia) return;
    StorageService.updateMediaLibraryItem(editingMedia.id, {
      fileName: editTitle.trim() || editingMedia.fileName,
      altText: editAlt.trim(),
      caption: editCaption.trim() || undefined,
      category: editCategory,
    }, adminRole);
    setMediaLibrary(StorageService.getMediaLibrary());
    setEditingMedia(null);
    showBanner(`Updated metadata for "${editingMedia.fileName}".`);
  };

  const handleDeleteMedia = (item: MediaLibraryItem) => {
    if (adminRole === 'Orders Staff') {
      alert('Orders Staff does not have permission to delete media files.');
      return;
    }
    if (item.usedIn && item.usedIn.length > 0 && adminRole !== 'Super Administrator') {
      alert(`This image is currently used in "${item.usedIn.join(', ')}". Only a Super Administrator can remove in-use assets.`);
      return;
    }
    if (confirm(`Are you sure you want to permanently delete "${item.fileName}" from the media library?`)) {
      const ok = StorageService.deleteMediaLibraryItem(item.id, adminRole);
      if (ok) {
        setMediaLibrary(StorageService.getMediaLibrary());
        showBanner(`Deleted "${item.fileName}" from media library.`);
      } else {
        alert('Could not delete media item. Permission denied.');
      }
    }
  };

  const handleAssignMediaToSection = (targetSectionKey: string) => {
    if (!assigningMedia) return;
    const target = sectionImages.find(r => r.key === targetSectionKey);
    if (!target) return;

    StorageService.updateSectionImage(target.id, {
      url: assigningMedia.url,
      altText: assigningMedia.altText || target.altText,
      caption: assigningMedia.caption || target.caption,
    }, adminRole);

    if (!assigningMedia.usedIn.includes(target.sectionLabel)) {
      StorageService.updateMediaLibraryItem(assigningMedia.id, {
        usedIn: [...assigningMedia.usedIn, target.sectionLabel]
      }, adminRole);
    }

    setSectionImages(StorageService.getSectionImages());
    setMediaLibrary(StorageService.getMediaLibrary());
    const updatedSettings = StorageService.getSettings();
    setSettings(updatedSettings);
    setFormSettings(updatedSettings);

    showBanner(`Assigned "${assigningMedia.fileName}" to section "${target.sectionLabel}".`);
    setAssigningMedia(null);
  };

  // Metrics
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'confirmed' || o.status === 'preparing');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const totalRevenueUSD = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.totalUSD, 0);
  const totalRevenueLRD = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.totalLRD, 0);

  // ================= LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F5F0E8] dark:bg-[#161110] transition-colors">
        <div className="max-w-md w-full bg-[#EDE3D5]/50 dark:bg-[#201918] border border-[#EDE3D5] dark:border-[#332624] p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#7B2635] text-[#F5F0E8] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-[#28201E] dark:text-[#EDE3D5]">
              Staff Concierge Portal
            </h2>
            <p className="text-xs text-[#28201E]/70 dark:text-[#A89D96] font-light">
              Authorized staff management for Bottega Restro & Miami Clipper.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] dark:text-[#EDE3D5] mb-1.5">
                Staff Role
              </label>
              <select
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white dark:bg-[#1A1413] border border-[#EDE3D5] dark:border-[#3E302E] text-xs text-[#28201E] dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none"
              >
                <option value="Super Administrator">Super Administrator (Full System Access & Media Deletion)</option>
                <option value="Website Administrator">Website Administrator (Image Management & Content)</option>
                <option value="Content Editor">Content Editor (Menu, Events & Pages)</option>
                <option value="Orders Staff">Orders & Booking Reception Desk (Read-Only Media)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#28201E] dark:text-[#EDE3D5] mb-1.5">
                Access Passcode / Security PIN
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-[#1A1413] border border-[#EDE3D5] dark:border-[#3E302E] text-xs text-[#28201E] dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none"
              />
              <span className="text-[10px] text-[#28201E]/60 dark:text-[#A89D96] mt-1 block font-light">
                Default demo passcode: <code className="text-[#7B2635] dark:text-[#D1556D] font-semibold">bottega2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Sign In to Management Portal
            </button>

            <button
              type="button"
              onClick={onExit}
              className="w-full py-2 text-xs font-medium text-[#28201E]/60 dark:text-[#A89D96] hover:text-[#28201E] dark:hover:text-[#EDE3D5] transition-colors"
            >
              ← Return to Public Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= MAIN AUTHENTICATED DASHBOARD =================
  const modules = [
    { id: 'overview', label: 'Overview & KPIs', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'page_images', label: 'Page Images', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'media_library', label: `Media Library (${mediaLibrary.length})`, icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'orders', label: `Orders (${pendingOrders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'bookings', label: `Bookings (${pendingBookings.length})`, icon: <Calendar className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu & Bars', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'pages', label: 'Content Editor', icon: <FileEdit className="w-4 h-4" /> },
    { id: 'events', label: 'Events Manager', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery Media', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Contact', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'bms_integration', label: 'Future BMS Specs', icon: <Network className="w-4 h-4" /> },
    { id: 'supabase_schema', label: 'Supabase SQL DDL', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner Message */}
      {saveBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveBanner}</span>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#201918] border border-neutral-200 dark:border-[#332624] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#7B2635]/10 dark:bg-[#7B2635]/25 border border-[#7B2635]/30 text-[#7B2635] dark:text-[#E07A8B] flex items-center justify-center shadow-xs">
            <Unlock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-bold text-neutral-900 dark:text-[#EDE3D5]">
                Bottega & Miami Clipper CMS Portal
              </h1>
              <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#2A201E] text-[10px] text-[#B38A45] dark:text-[#C49A52] font-bold border border-neutral-200 dark:border-[#3E302E]">
                {adminRole}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-[#A89D96]">
              Logged in as authorized staff · Oldroad Junction, Monrovia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#2A201E] border border-neutral-200 dark:border-[#3E302E] text-xs font-semibold text-neutral-800 dark:text-[#EDE3D5] hover:border-[#7B2635] hover:bg-white dark:hover:bg-[#332724] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#7B2635] dark:text-[#E07A8B]" /> View Public Site
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-[#332624] scrollbar-none">
        {modules.map(mod => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
              activeModule === mod.id
                ? 'bg-[#7B2635] text-white font-bold shadow-sm'
                : 'bg-white dark:bg-[#201918] text-neutral-600 dark:text-[#A89D96] hover:text-neutral-900 dark:hover:text-[#EDE3D5] hover:bg-neutral-50 dark:hover:bg-[#2A201E] border border-neutral-200 dark:border-[#332624]'
            }`}
          >
            {mod.icon}
            <span>{mod.label}</span>
          </button>
        ))}
      </div>

      {/* ================= MODULE 1: OVERVIEW & KPIS ================= */}
      {activeModule === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">Pending Orders</span>
              <span className="text-2xl font-bold text-neutral-900 tabular-nums">{pendingOrders.length}</span>
              <p className="text-[10px] text-[#c59b27] font-medium">Food & drinks queue</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">Pending Appointments</span>
              <span className="text-2xl font-bold text-neutral-900 tabular-nums">{pendingBookings.length}</span>
              <p className="text-[10px] text-[#c59b27] font-medium">Massage, salon & barber</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">Total Orders Revenue</span>
              <span className="text-lg font-bold text-neutral-900 tabular-nums block">
                ${totalRevenueUSD.toFixed(2)} USD
              </span>
              <span className="text-xs text-neutral-600 font-medium tabular-nums">
                + {totalRevenueLRD.toLocaleString()} LRD
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">Contact Inquiries</span>
              <span className="text-2xl font-bold text-neutral-900 tabular-nums">{enquiries.length}</span>
              <p className="text-[10px] text-emerald-600 font-medium">Submitted from web</p>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Recent Food Orders
                </h3>
                <button
                  onClick={() => setActiveModule('orders')}
                  className="text-xs text-[#c59b27] font-semibold hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 4).map(o => (
                  <div key={o.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{o.orderRef}</span>
                        <span className="text-neutral-500">({o.customerName})</span>
                      </div>
                      <span className="text-[11px] text-[#c59b27] font-semibold tabular-nums">
                        {o.totalUSD > 0 && `$${o.totalUSD.toFixed(2)} USD `}
                        {o.totalLRD > 0 && `${o.totalLRD.toLocaleString()} LRD`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        o.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        o.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
                        o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Pending Appointment Requests
                </h3>
                <button
                  onClick={() => setActiveModule('bookings')}
                  className="text-xs text-[#c59b27] font-semibold hover:underline"
                >
                  Manage Bookings →
                </button>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 4).map(b => (
                  <div key={b.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-neutral-900">{b.serviceTitle}</p>
                      <p className="text-[11px] text-neutral-500">
                        {b.customerName} · {b.preferredDate} ({b.preferredTime})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODULE: PAGE IMAGE MANAGER ================= */}
      {activeModule === 'page_images' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#201918] border border-neutral-200 dark:border-[#332624] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-[#332624]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-[#EDE3D5]">
                  Website Section Image Management
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#7B2635]/10 text-[#7B2635] dark:text-[#E07A8B] text-[10px] font-bold">
                  {sectionImages.length} Configured Sections
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-[#A89D96]">
                Inspect, replace, or reset photographs for any website section. Live updates apply directly to the website without code changes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveModule('media_library')}
                className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-[#2A201E] text-neutral-700 dark:text-[#EDE3D5] text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-[#382C29] transition-colors flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4 text-[#7B2635] dark:text-[#E07A8B]" /> Open Media Library
              </button>
            </div>
          </div>

          {/* Page Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-[#332624] scrollbar-none">
            {(['Homepage', 'Order Online', 'Salon & Masseuse', 'Gallery', 'Events & Lounge', 'Contact Us', 'Brand'] as const).map(pTab => (
              <button
                key={pTab}
                onClick={() => setActiveImagePageTab(pTab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeImagePageTab === pTab
                    ? 'bg-[#7B2635] text-white font-bold shadow-xs'
                    : 'bg-neutral-50 dark:bg-[#2A201E] text-neutral-600 dark:text-[#A89D96] hover:bg-neutral-100 dark:hover:bg-[#382C29]'
                }`}
              >
                {pTab}
                <span className="ml-1.5 opacity-70 text-[10px]">
                  ({sectionImages.filter(s => s.page === pTab).length})
                </span>
              </button>
            ))}
          </div>

          {/* Section Image Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionImages.filter(s => s.page === activeImagePageTab).map(sec => (
              <div 
                key={sec.id} 
                className="rounded-2xl border border-neutral-200 dark:border-[#332624] bg-neutral-50/50 dark:bg-[#1A1413] overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#7B2635]/40 transition-colors"
              >
                <div>
                  {/* Image Preview */}
                  <div className="relative h-48 bg-neutral-900 overflow-hidden group">
                    <AppImage
                      src={sec.url}
                      alt={sec.altText}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                      {sec.page}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#7B2635] text-[10px] font-bold text-white uppercase">
                      {sec.category}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2.5 text-xs">
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-[#EDE3D5] text-sm leading-snug">
                        {sec.sectionLabel}
                      </h4>
                      <code className="text-[10px] font-mono text-neutral-400 dark:text-[#A89D96] block mt-0.5">
                        Key: {sec.key}
                      </code>
                    </div>

                    {sec.recommendedDimensions && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7B2635] dark:text-[#E07A8B] font-medium bg-[#7B2635]/5 dark:bg-[#7B2635]/15 p-2 rounded-lg">
                        <Tag className="w-3.5 h-3.5 shrink-0" />
                        <span>Recommended: <strong>{sec.recommendedDimensions}</strong></span>
                      </div>
                    )}

                    <div className="space-y-1 text-[11px] text-neutral-600 dark:text-[#A89D96]">
                      <p className="line-clamp-2">
                        <strong className="text-neutral-700 dark:text-[#EDE3D5]">Alt text:</strong> {sec.altText}
                      </p>
                      {sec.caption && (
                        <p className="line-clamp-1 italic text-neutral-500 dark:text-[#A89D96]">
                          "{sec.caption}"
                        </p>
                      )}
                      <p className="text-[10px] text-neutral-400 dark:text-[#7A6E6A] pt-1">
                        Last modified: {new Date(sec.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReplaceModal(sec)}
                    disabled={adminRole === 'Orders Staff'}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#7B2635] hover:bg-[#641F2B] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Replace Photo
                  </button>

                  <button
                    onClick={() => handleResetSectionImage(sec)}
                    disabled={adminRole === 'Orders Staff'}
                    title="Reset to default original photograph"
                    className="py-2 px-2.5 rounded-xl border border-neutral-300 dark:border-[#3E302E] bg-white dark:bg-[#201918] hover:bg-neutral-100 dark:hover:bg-[#2E2321] text-neutral-700 dark:text-[#EDE3D5] text-xs transition-colors disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODULE: WEBSITE MEDIA LIBRARY ================= */}
      {activeModule === 'media_library' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#201918] border border-neutral-200 dark:border-[#332624] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-[#332624]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-[#EDE3D5]">
                  Website Media Library
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                  {mediaLibrary.length} Total Assets
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-[#A89D96]">
                Upload, categorize, inspect, and manage photography across all four Bottega & Miami departments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenUploadMediaModal}
                disabled={adminRole === 'Orders Staff'}
                className="px-4 py-2 rounded-xl bg-[#7B2635] hover:bg-[#641F2B] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Upload New Media
              </button>
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by filename, alt text, or caption..."
                value={mediaSearchQuery}
                onChange={(e) => setMediaSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'homepage', 'restaurant', 'bar', 'salon', 'massage', 'barbershop', 'events', 'gallery', 'contact', 'brand'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setMediaCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-all ${
                    mediaCategoryFilter === cat
                      ? 'bg-[#7B2635] text-white font-bold shadow-xs'
                      : 'bg-neutral-100 dark:bg-[#2A201E] text-neutral-600 dark:text-[#A89D96] hover:bg-neutral-200 dark:hover:bg-[#382C29]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaLibrary
              .filter(m => (mediaCategoryFilter === 'all' || m.category === mediaCategoryFilter) && 
                (!mediaSearchQuery || 
                  m.fileName.toLowerCase().includes(mediaSearchQuery.toLowerCase()) || 
                  (m.altText && m.altText.toLowerCase().includes(mediaSearchQuery.toLowerCase())) ||
                  (m.caption && m.caption.toLowerCase().includes(mediaSearchQuery.toLowerCase()))
                )
              )
              .map(item => (
                <div 
                  key={item.id}
                  className="rounded-2xl border border-neutral-200 dark:border-[#332624] bg-neutral-50/40 dark:bg-[#1A1413] overflow-hidden flex flex-col justify-between group shadow-xs hover:border-[#7B2635]/40 transition-colors"
                >
                  <div>
                    <div className="relative h-36 bg-neutral-900 overflow-hidden">
                      <AppImage
                        src={item.url}
                        alt={item.altText}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-semibold text-white uppercase">
                        {item.category}
                      </span>
                      {item.fileSize && (
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white/90">
                          {item.fileSize}
                        </span>
                      )}
                    </div>

                    <div className="p-3 space-y-1.5 text-xs">
                      <p className="font-bold text-neutral-900 dark:text-[#EDE3D5] truncate" title={item.fileName}>
                        {item.fileName}
                      </p>
                      
                      {/* Used in tags */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400 dark:text-[#A89D96] uppercase tracking-wider font-semibold block">
                          Used in:
                        </span>
                        {item.usedIn && item.usedIn.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.usedIn.map(u => (
                              <span key={u} className="px-1.5 py-0.5 rounded bg-[#7B2635]/10 dark:bg-[#7B2635]/25 text-[#7B2635] dark:text-[#E07A8B] text-[9px] font-semibold truncate max-w-full">
                                {u}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-400 dark:text-[#7A6E6A] italic">Unassigned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2.5 pt-0 flex items-center justify-between gap-1 border-t border-neutral-200/60 dark:border-[#332624] text-xs">
                    <button
                      onClick={() => setAssigningMedia(item)}
                      disabled={adminRole === 'Orders Staff'}
                      className="px-2 py-1 rounded bg-neutral-100 dark:bg-[#2A201E] hover:bg-[#7B2635] hover:text-white text-neutral-700 dark:text-[#EDE3D5] text-[10px] font-semibold transition-colors disabled:opacity-50"
                      title="Assign to Section"
                    >
                      Assign
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditMedia(item)}
                        disabled={adminRole === 'Orders Staff'}
                        className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#382C29] text-neutral-600 dark:text-[#A89D96] transition-colors disabled:opacity-50"
                        title="Edit Metadata"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteMedia(item)}
                        disabled={adminRole === 'Orders Staff'}
                        className="p-1.5 rounded hover:bg-red-500 hover:text-white text-neutral-500 transition-colors disabled:opacity-50"
                        title="Delete Media Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= MODULE 2: ORDERS MANAGEMENT ================= */}
      {activeModule === 'orders' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Online Food Orders Pipeline
              </h2>
              <p className="text-xs text-neutral-500">
                Update kitchen status, contact customers on WhatsApp, and view delivery details.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map(order => {
              const customerWhatsApp = (order.whatsapp || order.phone).replace(/[^0-9]/g, '');

              return (
                <div key={order.id} className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-bold text-neutral-900">
                          {order.orderRef}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white text-[10px] uppercase font-bold text-[#c59b27] border border-neutral-200 shadow-xs">
                          {order.orderType}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Client: <strong className="text-neutral-900">{order.customerName}</strong> · Phone: {order.phone}
                      </p>
                      {order.deliveryAddress && (
                        <p className="text-xs text-neutral-700">
                          Delivery: {order.deliveryAddress}
                        </p>
                      )}
                      {order.orderNotes && (
                        <p className="text-xs text-amber-700 italic">
                          Notes: "{order.orderNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${customerWhatsApp}?text=${encodeURIComponent(`Hello ${order.customerName}, this is Bottega Restro regarding your order ${order.orderRef}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp Client
                      </a>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                      Ordered Items:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-white border border-neutral-200 flex justify-between">
                          <span className="text-neutral-800 font-medium">{it.quantity}x {it.name} {it.selectedVariant ? `(${it.selectedVariant})` : ''}</span>
                          <span className="font-bold text-[#c59b27] tabular-nums">
                            {it.currency === 'USD' ? `$${(it.price * it.quantity).toFixed(2)}` : `${(it.price * it.quantity).toLocaleString()} LRD`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Pipeline Buttons */}
                  <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 font-medium">Change Status:</span>
                      {(['new', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'] as Order['status'][]).map(st => (
                        <button
                          key={st}
                          onClick={() => handleOrderStatusChange(order.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                            order.status === st
                              ? 'bg-[#c59b27] text-white shadow-xs'
                              : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#c59b27] tabular-nums">
                        Total: {order.totalUSD > 0 && `$${order.totalUSD.toFixed(2)} USD `}
                        {order.totalLRD > 0 && `${order.totalLRD.toLocaleString()} LRD`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODULE 3: APPOINTMENT MANAGEMENT ================= */}
      {activeModule === 'bookings' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Appointment Bookings (Massage, Salon & Barbershop)
              </h2>
              <p className="text-xs text-neutral-500">
                Approve, decline, reschedule, and prevent double-booking conflicts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {bookings.map(bk => {
              const cleanWhatsApp = (bk.whatsapp || bk.phone).replace(/[^0-9]/g, '');

              return (
                <div key={bk.id} className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900">{bk.bookingRef}</span>
                        <span className="px-2 py-0.5 rounded bg-white text-[10px] uppercase font-bold text-[#c59b27] border border-neutral-200 shadow-xs">
                          {bk.department}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          bk.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          bk.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bk.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-neutral-900 mt-1">{bk.serviceTitle}</h4>
                      <p className="text-neutral-600 mt-0.5">
                        Client: <strong className="text-neutral-900">{bk.customerName}</strong> · Phone: {bk.phone} · Specialist: {bk.staffName || 'Any'}
                      </p>
                      <p className="text-[#c59b27] font-semibold mt-0.5">
                        Slot: {bk.preferredDate} at {bk.preferredTime}
                      </p>
                      {bk.additionalNotes && (
                        <p className="text-amber-800 italic mt-1">Client notes: "{bk.additionalNotes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello ${bk.customerName}, this is Miami Clipper & Spa regarding your appointment request ${bk.bookingRef} for ${bk.serviceTitle}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp Client
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-neutral-500 font-medium">Action:</span>
                    <button
                      onClick={() => handleBookingStatusChange(bk.id, 'confirmed')}
                      className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold"
                    >
                      Approve & Confirm
                    </button>
                    <button
                      onClick={() => handleBookingStatusChange(bk.id, 'declined')}
                      className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-semibold"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleBookingStatusChange(bk.id, 'completed')}
                      className="px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium border border-neutral-200"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODULE 4: MENU & BAR MANAGEMENT ================= */}
      {activeModule === 'menu' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Menu & Beverage Catalogue Management
              </h2>
              <p className="text-xs text-neutral-500">
                Update dish pricing, original currencies, and availability for Main Bar and Outside Bar separately.
              </p>
            </div>
            <button
              onClick={() => setIsAddingMenuItem(true)}
              className="px-4 py-2 rounded-xl bg-[#c59b27] text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#b0871d] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          {/* Add Item Modal */}
          {isAddingMenuItem && (
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-300 space-y-4">
              <h3 className="font-bold text-sm text-neutral-900">Add New Food or Drink Item</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Grilled Red Snapper"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Section *</label>
                  <select
                    value={newItem.section}
                    onChange={(e) => setNewItem({ ...newItem, section: e.target.value as MenuSection })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                  >
                    <option value="restaurant">Restaurant Food</option>
                    <option value="main_bar">Main Bar Lounge</option>
                    <option value="outside_bar">Outside Bar Terrace</option>
                    <option value="wines">Wines</option>
                    <option value="cocktails">Cocktails</option>
                    <option value="non_alcoholic">Non-Alcoholic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Category Name *</label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Seafood & Grill"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Currency *</label>
                  <select
                    value={newItem.currency}
                    onChange={(e) => setNewItem({ ...newItem, currency: e.target.value as Currency })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="LRD">LRD (Liberian Dollars)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Image URL or Local Path</label>
                  <input
                    type="text"
                    value={newItem.image || ''}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="/images/restaurant/... or https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 text-xs resize-none focus:border-[#c59b27] focus:outline-none"
                  placeholder="Ingredients, sides, serving details..."
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateMenuItem}
                  className="px-4 py-2 rounded-lg bg-[#c59b27] text-white font-bold text-xs hover:bg-[#b0871d]"
                >
                  Save Item to Menu
                </button>
                <button
                  onClick={() => setIsAddingMenuItem(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-800 text-xs hover:bg-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Item Modal */}
          {editingMenuItem && (
            <div className="p-5 rounded-2xl bg-neutral-50 border-2 border-[#c59b27] space-y-4">
              <h3 className="font-bold text-sm text-neutral-900">Edit Item: {editingMenuItem.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Item Name</label>
                  <input
                    type="text"
                    value={editingMenuItem.name}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={editingMenuItem.price}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Currency</label>
                  <select
                    value={editingMenuItem.currency}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, currency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="LRD">LRD</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isAvailable}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isAvailable: e.target.checked })}
                    className="rounded text-[#c59b27]"
                  />
                  <span>Is Available</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isFeatured}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isFeatured: e.target.checked })}
                    className="rounded text-[#c59b27]"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveMenuItem}
                  className="px-4 py-2 rounded-lg bg-[#c59b27] text-white font-bold text-xs hover:bg-[#b0871d]"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingMenuItem(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-800 text-xs hover:bg-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Menu Items Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {menuItems.map(item => (
                  <tr key={item.id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="py-3 px-4 font-semibold text-neutral-900">{item.name}</td>
                    <td className="py-3 px-4 capitalize text-neutral-600">{item.section.replace('_', ' ')}</td>
                    <td className="py-3 px-4 text-neutral-500">{item.category}</td>
                    <td className="py-3 px-4 font-bold text-[#c59b27] tabular-nums">
                      {item.currency === 'USD' ? `$${item.price.toFixed(2)}` : `${item.price.toLocaleString()} LRD`}
                    </td>
                    <td className="py-3 px-4">
                      {item.isAvailable ? (
                        <span className="text-emerald-700 font-semibold">In Stock</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Unavailable</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingMenuItem(item)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#c59b27] hover:text-white text-neutral-700 transition-colors"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-500 text-neutral-700 hover:text-white transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODULE 5: PAGE & CONTENT EDITOR ================= */}
      {activeModule === 'pages' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Website Content & Hero Editor
              </h2>
              <p className="text-xs text-neutral-500">
                Modify homepage hero text, subtext, taglines, and brand copy without touching code.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-xl bg-[#c59b27] text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#b0871d] transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Content Changes
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Business Display Name
              </label>
              <input
                type="text"
                value={formSettings.heroTitle}
                onChange={(e) => setFormSettings({ ...formSettings, heroTitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={3}
                value={formSettings.heroSubtext}
                onChange={(e) => setFormSettings({ ...formSettings, heroSubtext: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 resize-none focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Official Logo URL
              </label>
              <input
                type="text"
                value={formSettings.logoUrl}
                onChange={(e) => setFormSettings({ ...formSettings, logoUrl: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODULE 6: EVENTS MANAGER ================= */}
      {activeModule === 'events' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Events & Entertainment Management
              </h2>
              <p className="text-xs text-neutral-500">
                Publish upcoming specials or move past promotions to the archive.
              </p>
            </div>
            <button
              onClick={() => setIsAddingEvent(true)}
              className="px-4 py-2 rounded-xl bg-[#c59b27] text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#b0871d] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>

          {isAddingEvent && (
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-300 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-neutral-900">Create New Event</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Event Title *</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Afrobeats Night"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Date & Frequency</label>
                  <input
                    type="text"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Every Saturday Night"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. 9:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 font-medium mb-1">Tag / Category</label>
                  <input
                    type="text"
                    value={newEvent.tag}
                    onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                    placeholder="e.g. Nightlife & Lounge"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 text-xs resize-none focus:border-[#c59b27] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateEvent}
                  className="px-4 py-2 rounded-lg bg-[#c59b27] text-white font-bold text-xs hover:bg-[#b0871d]"
                >
                  Publish Event
                </button>
                <button
                  onClick={() => setIsAddingEvent(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-800 text-xs hover:bg-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {events.map(evt => (
              <div key={evt.id} className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-neutral-900">{evt.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-[10px] text-[#c59b27] font-semibold shadow-xs">
                      {evt.tag}
                    </span>
                    {evt.isArchived && (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-semibold">
                        Archived
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {evt.date} · {evt.startTime} · Location: {evt.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleEventPublish(evt)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      evt.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {evt.isPublished ? 'Published' : 'Draft'}
                  </button>
                  <button
                    onClick={() => handleToggleEventArchive(evt)}
                    className="px-3 py-1 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 text-xs shadow-xs"
                  >
                    {evt.isArchived ? 'Restore' : 'Archive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODULE 7: GALLERY MANAGER ================= */}
      {activeModule === 'gallery' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Gallery Media Management
              </h2>
              <p className="text-xs text-neutral-500">
                Add new venue photos, edit descriptions, or remove outdated shots.
              </p>
            </div>
          </div>

          {/* Add Media Form */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-300 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-neutral-900">Add Photo / Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Lounge Booths at Night"
                  value={newGalleryTitle}
                  onChange={(e) => setNewGalleryTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Category *</label>
                <select
                  value={newGalleryCat}
                  onChange={(e) => setNewGalleryCat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="bar_lounge">Bar Lounge</option>
                  <option value="outside_bar">Outside Bar Terrace</option>
                  <option value="beauty_salon">Beauty Salon & Spa</option>
                  <option value="barbershop">Miami Barbershop</option>
                  <option value="events">Events</option>
                  <option value="general">General Business</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 font-medium mb-1">Image URL / Path *</label>
                <input
                  type="text"
                  placeholder="/images/gallery/... or https://..."
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleAddGalleryItem}
              className="px-4 py-2 rounded-lg bg-[#c59b27] text-white font-bold text-xs hover:bg-[#b0871d] shadow-sm"
            >
              Add Media to Gallery
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map(g => (
              <div key={g.id} className="p-2.5 rounded-xl bg-white border border-neutral-200 space-y-2 shadow-xs">
                <div className="h-32 rounded-lg overflow-hidden relative border border-neutral-100">
                  <AppImage src={g.image} alt={g.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDeleteGallery(g.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm z-10"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-semibold text-neutral-900 truncate">{g.title}</p>
                <span className="text-[10px] text-neutral-500 capitalize block">{g.category.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODULE 8: ENQUIRIES ================= */}
      {activeModule === 'enquiries' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Customer Contact Enquiries
              </h2>
              <p className="text-xs text-neutral-500">
                Messages submitted through the public Contact page enquiry form.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {enquiries.map(enq => (
              <div key={enq.id} className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{enq.name}</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-[10px] text-[#c59b27] font-semibold shadow-xs">
                      {enq.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500">Contact: {enq.contact}</span>
                </div>
                <p className="text-neutral-800 bg-white p-3 rounded-xl border border-neutral-200 shadow-xs leading-relaxed">
                  "{enq.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODULE 9: SETTINGS & CONTACT ================= */}
      {activeModule === 'settings' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Business Contact & Social Settings
              </h2>
              <p className="text-xs text-neutral-500">
                Configure official WhatsApp number, phone, opening hours, and social media handles.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-xl bg-[#c59b27] text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#b0871d] transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                WhatsApp Hotline Number (Digits with country code)
              </label>
              <input
                type="text"
                value={formSettings.whatsappNumber}
                onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                placeholder="231774499840"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Telephone Call Number
              </label>
              <input
                type="text"
                value={formSettings.phone}
                onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
                placeholder="+231 77 449 9840"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={formSettings.address}
                onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formSettings.email}
                onChange={(e) => setFormSettings({ ...formSettings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                TikTok Profile URL
              </label>
              <input
                type="text"
                value={formSettings.socialLinks.tiktok}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  socialLinks: { ...formSettings.socialLinks, tiktok: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={formSettings.socialLinks.instagram}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  socialLinks: { ...formSettings.socialLinks, instagram: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-600 mb-1">
                Facebook Page URL
              </label>
              <input
                type="text"
                value={formSettings.socialLinks.facebook}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  socialLinks: { ...formSettings.socialLinks, facebook: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 focus:border-[#c59b27] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODULE 10: FUTURE BMS INTEGRATION ================= */}
      {activeModule === 'bms_integration' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="font-display text-lg font-bold text-neutral-900">
              Future Business Management System (BMS) Integration Architecture
            </h2>
            <p className="text-xs text-neutral-500">
              Decoupled bridge design ensuring the website can sync with the separate BMS when finished.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf8f2] border border-[#c59b27]/30 space-y-2 text-xs text-neutral-800">
            <h4 className="font-bold text-sm text-[#9e7b1c]">Architecture Principles:</h4>
            <p>1. <strong>Decoupled Persistence:</strong> Public web visitors order and submit appointments without depending on BMS server uptime.</p>
            <p>2. <strong>Bidirectional REST & Webhook Channels:</strong> Web orders push to kitchen POS queue; catalog & price changes propagate down to website.</p>
            <p>3. <strong>Currency Integrity:</strong> Both systems maintain independent USD and LRD ledgers with zero automated conversion loss.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Defined BMS API Contracts:
            </h4>
            {FUTURE_BMS_INTEGRATION_SPEC.endpoints.map((ep, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#c59b27] text-white font-bold text-[10px]">
                    {ep.method}
                  </span>
                  <code className="text-neutral-900 font-mono font-semibold">{ep.path}</code>
                </div>
                <p className="text-neutral-600">{ep.description}</p>
                {ep.samplePayload && (
                  <pre className="p-3 rounded-lg bg-neutral-900 text-emerald-300 font-mono text-[11px] overflow-x-auto shadow-inner">
                    {JSON.stringify(ep.samplePayload, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODULE 11: SUPABASE SQL MIGRATION & LIVE CONNECTION ================= */}
      {activeModule === 'supabase_schema' && (
        <div className="p-6 rounded-3xl bg-white border border-[#EDE3D5] space-y-6 shadow-xs font-sans">
          
          {/* Live Supabase Connection Card */}
          <div className="p-5 rounded-2xl bg-[#F5F0E8] border border-[#EDE3D5] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7B2635] text-[#F5F0E8] flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-[#28201E]">
                    Connected Supabase Project
                  </h3>
                  <p className="text-xs text-[#28201E]/70 font-light">
                    Project Ref: <code className="font-mono font-bold text-[#7B2635]">sdlyhrzhhccinvxvswou</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={testSupabaseConnection}
                disabled={isTestingSupabase}
                className="px-4 py-2 bg-[#7B2635] hover:bg-[#641F2B] text-[#F5F0E8] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xs"
              >
                {isTestingSupabase ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isTestingSupabase ? 'Testing Connection...' : 'Test Live Connection'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-light">
              <div className="p-3 bg-white border border-[#EDE3D5]">
                <span className="text-[10px] text-[#28201E]/60 uppercase tracking-wider block font-semibold">Endpoint URL</span>
                <span className="font-mono text-xs text-[#28201E] select-all">https://sdlyhrzhhccinvxvswou.supabase.co</span>
              </div>
              <div className="p-3 bg-white border border-[#EDE3D5]">
                <span className="text-[10px] text-[#28201E]/60 uppercase tracking-wider block font-semibold">Anon Public Key</span>
                <span className="font-mono text-xs text-emerald-700 font-medium">eyJhbGci...Vp3Mg (Active & Authenticated)</span>
              </div>
            </div>

            {supabaseStatus && (
              <div className={`p-3.5 rounded-xl border text-xs ${
                supabaseStatus.connected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-medium">{supabaseStatus.message}</p>
                    {supabaseStatus.timestamp && (
                      <p className="text-[10px] opacity-75">Verified at: {new Date(supabaseStatus.timestamp).toLocaleTimeString()}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SQL Script Header & Copy */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE3D5]">
            <div>
              <h2 className="font-serif text-xl font-normal text-[#28201E]">
                PostgreSQL DDL & RLS Migration Script
              </h2>
              <p className="text-xs text-[#28201E]/70 font-light">
                Ready to execute in your Supabase SQL Editor. Creates all 12 tables, indexes, and security policies.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
                setCopiedSql(true);
                setTimeout(() => setCopiedSql(false), 2000);
              }}
              className="px-4 py-2 bg-[#7B2635] text-[#F5F0E8] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#641F2B] transition-colors shadow-xs"
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSql ? 'Copied to Clipboard' : 'Copy SQL Script'}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#28201E] border border-[#28201E] text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[460px] shadow-inner">
            {SUPABASE_SQL_MIGRATION}
          </pre>
        </div>
      )}

      {/* ================= MODAL 1: SAFE SECTION IMAGE REPLACEMENT ================= */}
      {replacingRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#201918] border border-neutral-200 dark:border-[#332624] rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#332624]">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900 dark:text-[#EDE3D5]">
                  Replace Section Image
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#A89D96]">
                  Target: <strong>{replacingRecord.sectionLabel}</strong> ({replacingRecord.page})
                </p>
              </div>
              <button
                onClick={() => setReplacingRecord(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2E2321] text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {replacementError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{replacementError}</span>
              </div>
            )}

            {/* Current vs Replacement Side-by-Side Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-[#A89D96]">
                  Current Active Image
                </span>
                <div className="h-36 rounded-xl bg-neutral-900 overflow-hidden border border-neutral-200 dark:border-[#332624]">
                  <AppImage src={replacingRecord.url} alt={replacingRecord.altText} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B2635] dark:text-[#E07A8B]">
                  New Selected Image Preview
                </span>
                <div className="h-36 rounded-xl bg-neutral-900 overflow-hidden border-2 border-dashed border-[#7B2635] flex items-center justify-center">
                  {(replacementSource === 'upload' && replacementPreviewUrl) ? (
                    <img src={replacementPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (replacementSource === 'library' && selectedLibraryId) ? (
                    <AppImage
                      src={mediaLibrary.find(m => m.id === selectedLibraryId)?.url || ''}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-neutral-400 dark:text-[#A89D96] px-3 text-center">
                      Choose an image below to preview
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Source Switcher */}
            <div className="flex border-b border-neutral-200 dark:border-[#332624]">
              <button
                type="button"
                onClick={() => setReplacementSource('upload')}
                className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
                  replacementSource === 'upload'
                    ? 'border-[#7B2635] text-[#7B2635] dark:text-[#E07A8B]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-[#EDE3D5]'
                }`}
              >
                Upload from Computer
              </button>
              <button
                type="button"
                onClick={() => setReplacementSource('library')}
                className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
                  replacementSource === 'library'
                    ? 'border-[#7B2635] text-[#7B2635] dark:text-[#E07A8B]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-[#EDE3D5]'
                }`}
              >
                Choose from Media Library ({mediaLibrary.length})
              </button>
            </div>

            {replacementSource === 'upload' ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-neutral-700 dark:text-[#EDE3D5]">
                  Select Image File (JPG, PNG, WEBP, AVIF — Max 5MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileSelectForReplace}
                  className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#7B2635] file:text-white hover:file:bg-[#641F2B] cursor-pointer"
                />
                {replacementFile && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Selected: {replacementFile.name} ({(replacementFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-medium text-neutral-700 dark:text-[#EDE3D5] block">
                  Select an Existing Asset:
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border border-neutral-200 dark:border-[#332624] rounded-xl">
                  {mediaLibrary.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedLibraryId(item.id)}
                      className={`h-16 rounded-lg overflow-hidden border-2 relative transition-all ${
                        selectedLibraryId === item.id
                          ? 'border-[#7B2635] ring-2 ring-[#7B2635]/40 scale-95'
                          : 'border-transparent hover:border-neutral-300'
                      }`}
                    >
                      <AppImage src={item.url} alt={item.altText} className="w-full h-full object-cover" />
                      {selectedLibraryId === item.id && (
                        <div className="absolute inset-0 bg-[#7B2635]/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Alternative Text (Alt Text)
                </label>
                <input
                  type="text"
                  value={replacementAlt}
                  onChange={(e) => setReplacementAlt(e.target.value)}
                  placeholder="Describes the image for accessibility & SEO"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={replacementCaption}
                  onChange={(e) => setReplacementCaption(e.target.value)}
                  placeholder="Editorial caption"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-[#332624]">
              <button
                type="button"
                onClick={() => setReplacingRecord(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-[#332624] text-xs font-semibold text-neutral-700 dark:text-[#EDE3D5] hover:bg-neutral-100 dark:hover:bg-[#2E2321] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReplacement}
                disabled={isReplacing}
                className="px-5 py-2 rounded-xl bg-[#7B2635] hover:bg-[#641F2B] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {isReplacing ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isReplacing ? 'Applying...' : 'Confirm & Apply to Section'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: UPLOAD NEW MEDIA ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#201918] border border-neutral-200 dark:border-[#332624] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#332624]">
              <h3 className="font-display text-base font-bold text-neutral-900 dark:text-[#EDE3D5]">
                Upload New Image to Media Library
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2E2321] text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
                {uploadError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Choose Image File (JPG, PNG, WEBP, AVIF — Max 5MB) *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileSelectForUpload}
                  className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#7B2635] file:text-white hover:file:bg-[#641F2B] cursor-pointer"
                />
              </div>

              {newMediaPreviewUrl && (
                <div className="h-36 rounded-xl bg-neutral-900 overflow-hidden border border-neutral-200 dark:border-[#332624]">
                  <img src={newMediaPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Display Title *
                </label>
                <input
                  type="text"
                  value={newMediaTitle}
                  onChange={(e) => setNewMediaTitle(e.target.value)}
                  placeholder="e.g. Lounge VIP Section"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Department / Category *
                </label>
                <select
                  value={newMediaCategory}
                  onChange={(e) => setNewMediaCategory(e.target.value as MediaCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none capitalize"
                >
                  {(['homepage', 'restaurant', 'bar', 'salon', 'massage', 'barbershop', 'events', 'gallery', 'contact', 'brand'] as const).map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={newMediaAlt}
                  onChange={(e) => setNewMediaAlt(e.target.value)}
                  placeholder="Detailed visual description"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Caption (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newMediaCaption}
                  onChange={(e) => setNewMediaCaption(e.target.value)}
                  placeholder="Editorial caption note..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] resize-none focus:border-[#7B2635] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-[#332624]">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-[#332624] text-xs font-semibold text-neutral-700 dark:text-[#EDE3D5] hover:bg-neutral-100 dark:hover:bg-[#2E2321] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUploadMedia}
                disabled={isUploadingMedia}
                className="px-5 py-2 rounded-xl bg-[#7B2635] hover:bg-[#641F2B] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {isUploadingMedia ? <Clock className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {isUploadingMedia ? 'Uploading...' : 'Save to Library'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: EDIT MEDIA METADATA ================= */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#201918] border border-neutral-200 dark:border-[#332624] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#332624]">
              <h3 className="font-display text-base font-bold text-neutral-900 dark:text-[#EDE3D5]">
                Edit Media Metadata
              </h3>
              <button
                onClick={() => setEditingMedia(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2E2321] text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="h-32 rounded-xl bg-neutral-900 overflow-hidden border border-neutral-200 dark:border-[#332624]">
                <AppImage src={editingMedia.url} alt={editingMedia.altText} className="w-full h-full object-cover" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  File Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as MediaCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none capitalize"
                >
                  {(['homepage', 'restaurant', 'bar', 'salon', 'massage', 'barbershop', 'events', 'gallery', 'contact', 'brand'] as const).map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] focus:border-[#7B2635] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-[#EDE3D5] mb-1">
                  Caption
                </label>
                <textarea
                  rows={2}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-[#1A1413] border border-neutral-200 dark:border-[#332624] text-xs text-neutral-900 dark:text-[#EDE3D5] resize-none focus:border-[#7B2635] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-[#332624]">
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-[#332624] text-xs font-semibold text-neutral-700 dark:text-[#EDE3D5] hover:bg-neutral-100 dark:hover:bg-[#2E2321] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMediaMetadata}
                className="px-5 py-2 rounded-xl bg-[#7B2635] hover:bg-[#641F2B] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: ASSIGN MEDIA TO SECTION ================= */}
      {assigningMedia && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-[#201918] border border-neutral-200 dark:border-[#332624] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-[#332624]">
              <h3 className="font-display text-base font-bold text-neutral-900 dark:text-[#EDE3D5]">
                Assign Image to Website Section
              </h3>
              <button
                onClick={() => setAssigningMedia(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-[#2E2321] text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="h-32 rounded-xl bg-neutral-900 overflow-hidden border border-neutral-200 dark:border-[#332624]">
                <AppImage src={assigningMedia.url} alt={assigningMedia.altText} className="w-full h-full object-cover" />
              </div>

              <p className="text-neutral-600 dark:text-[#A89D96]">
                Assign <strong>"{assigningMedia.fileName}"</strong> to which live section on the website?
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto p-1 border border-neutral-200 dark:border-[#332624] rounded-xl">
                {sectionImages.map(sec => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleAssignMediaToSection(sec.key)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#2E2321] flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-[#EDE3D5] text-xs">
                        {sec.sectionLabel}
                      </p>
                      <span className="text-[10px] text-neutral-400 dark:text-[#A89D96]">
                        {sec.page} · {sec.key}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#7B2635] transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-100 dark:border-[#332624]">
              <button
                type="button"
                onClick={() => setAssigningMedia(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-[#332624] text-xs font-semibold text-neutral-700 dark:text-[#EDE3D5] hover:bg-neutral-100 dark:hover:bg-[#2E2321] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
