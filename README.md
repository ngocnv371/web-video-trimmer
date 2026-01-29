# 🎬 Web Video Trimmer

A high-performance, browser-based video editing tool leveraging **GPU hardware acceleration** for lightning-fast trimming and exporting without any server-side processing.

## 🚀 Key Features

- **Pure Browser Acceleration**: Uses the `MediaRecorder` and `Canvas` APIs to process video directly on your GPU. Your files never leave your device.
- **Precision Trimming**:
  - **Visual Timeline**: Interactive waveform track with dual-range handles for intuitive selection.
  - **Precise Inputs**: Frame-accurate manual timestamp entry supporting `MM:SS.ms` format.
- **Real-time Preview**: High-performance video player with synchronized playhead and range-limited looping.
- **Export Options**: 
  - Support for **WebM (VP9)** and **WebM (VP8)** codecs.
  - Automatic hardware-accelerated rendering.
  - Integrated **"VIDEO TRIMMER" watermark** on exports.
- **Pro Workflow**: 
  - **Keyboard Shortcuts**: Press `Space` to toggle playback.
  - **Responsive Design**: Optimized for both desktop and mobile viewing.

## 🛠 Tech Stack

- **Framework**: React 19 (Functional Components & Hooks)
- **Styling**: Tailwind CSS with Glassmorphism UI
- **Icons**: Lucide React
- **Video Processing**:
  - HTML5 Video API
  - Canvas API (Frame extraction & Watermarking)
  - MediaRecorder API (Hardware-accelerated encoding)
  - Web Audio API (Audio track routing)

## 📖 How to Use

1. **Upload**: Drag and drop or click the picker to select a video file (MP4, MOV, WEBM).
2. **Trim**: 
   - Drag the indigo handles on the timeline to set your range.
   - Or, type specific start/end times in the manual input boxes for millisecond precision.
3. **Preview**: Use the **Play** button or `Spacebar` to review your selection.
4. **Export**: Select your preferred codec and click **Export Clip**.
5. **Download**: Once the GPU finishes baking the video, click the download button to save your trimmed `.webm` file.

## 🔒 Privacy & Security

This is a **serverless application**. All video processing happens locally in your browser's memory and GPU. No data is uploaded to any server, making it 100% private and secure for sensitive content.

---

*Optimized for Chromium-based browsers (Chrome, Edge) for the best hardware acceleration performance.*