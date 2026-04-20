"use client"
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react';

// MediaItemType defines the structure of a media item
export interface MediaItemType {
    id: number;
    type: string;
    title: string;
    desc: string;
    url: string;
    span: string;
    rotate?: number;
    scale?: number;
}

// MediaItem component renders either a video or image based on item.type
const MediaItem = ({ item, className, onClick }: { item: MediaItemType, className?: string, onClick?: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null); // Reference for video element
    const [isInView, setIsInView] = useState(false); // To track if video is in the viewport
    const [isBuffering, setIsBuffering] = useState(true);  // To track if video is buffering

    // Intersection Observer to detect if video is in view and play/pause accordingly
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setIsInView(entry.isIntersecting); // Set isInView to true if the video is in view
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current); // Start observing the video element
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current); // Clean up observer when component unmounts
            }
        };
    }, []);

    // Handle video play/pause based on whether the video is in view or not
    useEffect(() => {
        let mounted = true;

        const handleVideoPlay = async () => {
            if (!videoRef.current || !isInView || !mounted) return; // Don't play if video is not in view or component is unmounted

            try {
                if (videoRef.current.readyState >= 3) {
                    setIsBuffering(false);
                    await videoRef.current.play(); // Play the video if it's ready
                } else {
                    setIsBuffering(true);
                    await new Promise((resolve) => {
                        if (videoRef.current) {
                            videoRef.current.oncanplay = resolve; // Wait until the video can start playing
                        }
                    });
                    if (mounted) {
                        setIsBuffering(false);
                        await videoRef.current.play();
                    }
                }
            } catch (error) {
                console.warn("Video playback failed:", error);
            }
        };

        if (isInView) {
            handleVideoPlay();
        } else if (videoRef.current) {
            videoRef.current.pause();
        }

        return () => {
            mounted = false;
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
        };
    }, [isInView]);

    if (item.type === 'video') {
        return (
            <div className={`${className} relative overflow-hidden bg-gray-900/10`}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onClick={onClick}
                    playsInline
                    muted
                    loop
                    preload="auto"
                    style={{
                        opacity: isBuffering ? 0.8 : 1,
                        transition: 'opacity 0.2s',
                        transform: `translateZ(0) ${item.rotate ? `rotate(${item.rotate}deg)` : ''} ${item.scale ? `scale(${item.scale})` : ''}`,
                        willChange: 'transform',
                    }}
                >
                    <source src={item.url} type="video/mp4" />
                </video>
                {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <img
            src={item.url} // Image source URL
            alt={item.title} // Alt text for the image
            className={`${className} object-cover cursor-pointer`} // Style the image
            onClick={onClick} // Trigger onClick when the image is clicked
            loading="lazy" // Lazy load the image for performance
            decoding="async" // Decode the image asynchronously
            style={{ transform: `${item.rotate ? `rotate(${item.rotate}deg)` : ''} ${item.scale ? `scale(${item.scale})` : ''}` }}
        />
    );
};

// GalleryModal component displays the selected media item in a modal
interface GalleryModalProps {
    selectedItem: MediaItemType;
    isOpen: boolean;
    onClose: () => void;
    setSelectedItem: (item: MediaItemType | null) => void;
    mediaItems: MediaItemType[]; // List of media items to display in the modal
}

const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
    const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });  // Track the position of the dockable panel

    if (!isOpen) return null; // Return null if the modal is not open

    return (
        <>
            {/* Main Modal */}
            <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
                className="fixed inset-0 w-full min-h-screen z-50 backdrop-blur-xl bg-black/60
                          flex items-center justify-center p-4"
            >
                {/* Main Content */}
                <div className="relative w-full max-w-5xl h-[80vh] flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <div className="flex-1 p-2 sm:p-4 md:p-8 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedItem.id}
                                className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black/20"
                                initial={{ y: 20, scale: 0.97, opacity: 0 }}
                                animate={{
                                    y: 0,
                                    scale: 1,
                                    opacity: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                        mass: 0.5
                                    }
                                }}
                                exit={{
                                    y: 20,
                                    scale: 0.97,
                                    opacity: 0,
                                    transition: { duration: 0.15 }
                                }}
                                onClick={onClose}
                            >
                                <MediaItem item={selectedItem} className="w-full h-full object-contain" onClick={onClose} />
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 
                                              bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                    <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                                        {selectedItem.title}
                                    </h3>
                                    <p className="text-white/70 text-sm sm:text-base mt-2 max-w-2xl">
                                        {selectedItem.desc}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Close Button */}
                    <motion.button
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 
                                  backdrop-blur-md border border-white/10 shadow-lg z-50"
                        onClick={onClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className='w-5 h-5' />
                    </motion.button>
                </div>
            </motion.div>

            {/* Draggable Dock */}
            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                initial={{ y: 100, opacity: 0 }}
                animate={{ x: dockPosition.x, y: dockPosition.y, opacity: 1 }}
                onDragEnd={(_, info) => {
                    setDockPosition(prev => ({
                        x: prev.x + info.offset.x,
                        y: prev.y + info.offset.y
                    }));
                }}
                className="fixed z-[60] left-1/2 bottom-8 -translate-x-1/2 touch-none"
            >
                <motion.div
                    className="relative rounded-2xl bg-white/10 backdrop-blur-2xl 
                             border border-white/20 shadow-2xl p-2
                             cursor-grab active:cursor-grabbing"
                >
                    <div className="flex items-center -space-x-3 px-2 py-1">
                        {mediaItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                }}
                                style={{
                                    zIndex: selectedItem.id === item.id ? 100 : mediaItems.length - index,
                                }}
                                className={`
                                    relative group
                                    w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 
                                    rounded-xl overflow-hidden 
                                    cursor-pointer hover:z-50
                                    transition-all duration-300
                                    ${selectedItem.id === item.id
                                        ? 'ring-2 ring-white shadow-2xl scale-110 !-translate-y-4'
                                        : 'hover:ring-2 hover:ring-white/50 hover:-translate-y-2'}
                                `}
                                initial={{ rotate: index % 2 === 0 ? -10 : 10 }}
                                animate={{
                                    rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -10 : 10,
                                }}
                            >
                                <MediaItem item={item} className="w-full h-full" onClick={() => setSelectedItem(item)} />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10" />
                                {selectedItem.id === item.id && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute -inset-2 bg-white/30 blur-2xl z-[-1]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

interface InteractiveBentoGalleryProps {
    mediaItems: MediaItemType[]
    title: string
    description: string
    className?: string
}

const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({ mediaItems, title, description, className }) => {
    const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
    const [items, setItems] = useState(mediaItems);
    const [isDragging, setIsDragging] = useState(false);

    return (
        <div className={`w-full py-12 ${className}`}>
            <div className="mb-12 text-center">
                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
                             bg-gradient-to-b from-white to-white/60 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h2>
                <motion.p
                    className="text-sm sm:text-base md:text-lg text-white/50 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {description}
                </motion.p>
            </div>
            
            <AnimatePresence mode="wait">
                {selectedItem ? (
                    <GalleryModal
                        selectedItem={selectedItem}
                        isOpen={true}
                        onClose={() => setSelectedItem(null)}
                        setSelectedItem={setSelectedItem}
                        mediaItems={items}
                    />
                ) : (
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[160px]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layoutId={`media-${item.id}`}
                                className={`relative overflow-hidden rounded-2xl cursor-move group ${item.span}`}
                                onClick={() => !isDragging && setSelectedItem(item)}
                                variants={{
                                    hidden: { y: 30, scale: 0.95, opacity: 0 },
                                    visible: {
                                        y: 0,
                                        scale: 1,
                                        opacity: 1,
                                        transition: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                            delay: index * 0.05
                                        }
                                    }
                                }}
                                whileHover={{ scale: 1.01, zIndex: 10 }}
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={1}
                                onDragStart={() => setIsDragging(true)}
                                onDragEnd={(_, info) => {
                                    setIsDragging(false);
                                    const moveDistance = info.offset.x + info.offset.y;
                                    if (Math.abs(moveDistance) > 80) {
                                        const newItems = [...items];
                                        const draggedItem = newItems[index];
                                        const targetIndex = moveDistance > 0 ?
                                            Math.min(index + 1, items.length - 1) :
                                            Math.max(index - 1, 0);
                                        newItems.splice(index, 1);
                                        newItems.splice(targetIndex, 0, draggedItem);
                                        setItems(newItems);
                                    }
                                }}
                            >
                                <MediaItem
                                    item={item}
                                    className="absolute inset-0 w-full h-full brightness-[0.8] group-hover:brightness-100 transition-all duration-500"
                                    onClick={() => !isDragging && setSelectedItem(item)}
                                />
                                <div className="absolute inset-x-0 bottom-0 p-4 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                    <h3 className="relative text-white text-xs sm:text-sm font-semibold truncate">
                                        {item.title}
                                    </h3>
                                    <p className="relative text-white/60 text-[10px] sm:text-xs mt-1 line-clamp-1">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InteractiveBentoGallery
