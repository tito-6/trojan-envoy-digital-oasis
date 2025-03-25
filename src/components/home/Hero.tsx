
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const elements = heroRef.current.querySelectorAll('.parallax-element');
      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = (e.clientX - centerX) / 25;
      const moveY = (e.clientY - centerY) / 25;
      
      elements.forEach((el) => {
        const depth = parseFloat((el as HTMLElement).dataset.depth || "1");
        const translationX = moveX * depth;
        const translationY = moveY * depth;
        
        (el as HTMLElement).style.transform = `translate(${translationX}px, ${translationY}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const partnerLogos = [
    { 
      name: "Google", 
      color: "#4285F4",
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 272 92" width="100" height="32">
          <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
          <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
          <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
          <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
        </svg>
      )
    },
    { 
      name: "Meta", 
      color: "#0081FB",
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 725 198" width="92" height="32">
          <path d="M30.877 197.194C43.346 192.968 54.809 186.59 54.809 169.585V101.2H84.138V198H0V101.2H30.877V197.194Z" fill="#0081FB"/>
          <path d="M144.109 99.584C153.921 99.584 162.94 101.307 162.94 101.307V130.636H144.109C134.891 130.636 127.705 137.822 127.705 147.04V198H97.828V101.2H127.705V113.64C127.705 113.64 134.297 99.584 144.109 99.584Z" fill="#0081FB"/>
          <path d="M177.861 121.824C177.861 110.4 191.63 99.584 213.483 99.584C232.691 99.584 241.511 107.37 241.511 107.37L231.701 132.744C231.701 132.744 224.883 126.944 214.673 126.944C204.465 126.944 199.714 132.359 199.714 137.822C199.714 152.086 238.537 145.49 238.537 173.628C238.537 195.481 222.503 198.5 207.251 198.5C182.221 198.5 170.191 184.821 170.191 184.821L183.959 159.062C183.959 159.062 195.703 171.104 211.697 171.104C219.269 171.104 225.301 168.1 225.301 162.638C225.301 145.104 177.861 152.086 177.861 121.824Z" fill="#0081FB"/>
          <path d="M259.203 101.2H324.161V128.56H294.825V198H259.203V101.2Z" fill="#0081FB"/>
          <path d="M432.865 101.2V198H402.988V185.56C402.988 185.56 395.802 198 381.135 198C354.559 198 339.909 173.628 339.909 150.044C339.909 123.468 355.749 101.2 380.542 101.2C394.02 101.2 402.395 113.047 402.395 113.047V101.2H432.865ZM390.354 127.965C377.469 127.965 370.284 136.632 370.284 150.044C370.284 163.222 377.767 171.698 390.354 171.698C401.205 171.698 403.582 161.193 403.582 150.044C403.582 136.039 397.243 127.965 390.354 127.965Z" fill="#0081FB"/>
          <path d="M600.828 101.198H630.706V198H600.828V101.198Z" fill="#0081FB"/>
          <path d="M600.828 0V30.4702H630.706V0H600.828Z" fill="#00B1EC"/>
          <path d="M497.776 101.198C470.013 101.198 448.16 123.468 448.16 149.584C448.16 176.338 471.225 198.5 498.368 198.5C528.393 198.5 545.926 176.634 545.926 149.584C545.926 124.257 525.121 101.198 497.776 101.198ZM498.368 126.944C511.451 126.944 515.904 139.436 515.904 149.584C515.904 160.028 510.265 172.76 498.368 172.76C487.331 172.76 480.738 161.435 480.738 149.584C480.738 138.245 486.739 126.944 498.368 126.944Z" fill="#0081FB"/>
          <path d="M545.927 0V83.9585H515.457V0H545.927Z" fill="#00B1EC"/>
          <path d="M666.33 101.198C638.567 101.198 616.714 123.468 616.714 149.584C616.714 176.338 639.779 198.5 666.922 198.5C696.947 198.5 714.48 176.634 714.48 149.584C714.48 124.257 693.675 101.198 666.33 101.198ZM666.922 126.944C680.005 126.944 684.457 139.436 684.457 149.584C684.457 160.028 678.818 172.76 666.922 172.76C655.884 172.76 649.291 161.435 649.291 149.584C649.291 138.245 655.292 126.944 666.922 126.944Z" fill="#0081FB"/>
        </svg>
      )
    },
    { 
      name: "SEMrush", 
      color: "#FF642D",
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113 31" width="98" height="32">
          <path fill="#FF642D" d="M45.53 9.679c-6.411 0-10.843 4.053-10.843 9.85 0 5.796 4.432 9.925 10.843 9.925 6.411 0 10.843-4.129 10.843-9.925 0-5.797-4.432-9.85-10.843-9.85zm0 15.494c-2.812 0-4.963-2.33-4.963-5.644 0-3.314 2.151-5.572 4.963-5.572 2.812 0 4.963 2.258 4.963 5.572 0 3.314-2.151 5.644-4.963 5.644zM23.193 10.038h-6.752v19.153h5.733V22.73c0-.664.354-1.066.911-1.066.557 0 .91.402.91 1.066v6.461h5.734v-8.046c0-3.162-2.379-5.156-5.506-5.156-1.201 0-1.961.325-2.031.325V10.038zm38.665 0v19.153h5.734V10.038h-5.734zm14.399 0l-6.373 19.153h5.733l3.809-13.39 3.922 13.39h5.848l-7.131-19.153h-5.808zm17.77 0v19.153h5.734V10.038h-5.734zM4.963 10.038H0v19.153h11.467v-4.394H4.963V10.038zm106.289 0v19.153H113V10.038h-1.748zM93.14 19.602c1.595 0 2.885-1.215 2.885-2.716 0-1.5-1.29-2.715-2.885-2.715-1.594 0-2.884 1.215-2.884 2.715 0 1.501 1.29 2.716 2.884 2.716z"/>
        </svg>
      )
    },
    { 
      name: "AWS", 
      color: "#FF9900",
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 75" width="78" height="32">
          <path d="M35.1 31.982h-4.968v14.061h4.938c3.563 0 5.356-2.555 5.356-7.07-.001-4.438-1.794-6.991-5.326-6.991zm-1.646 11.471h-1.106V34.573h1.106c2.333 0 3.597 1.686 3.597 4.401 0 2.776-1.264 4.479-3.597 4.479z" fill="#252F3E"/>
          <path d="M42.979 36.984c-2.041 0-3.29 1.51-3.29 3.99 0 2.521 1.264 4.011 3.29 4.011 2.04 0 3.292-1.489 3.292-4.011 0-2.48-1.252-3.99-3.292-3.99zm0 6.47c-1.247 0-1.887-1.053-1.887-2.479 0-1.407.64-2.458 1.887-2.458 1.246 0 1.887 1.051 1.887 2.458 0 1.426-.641 2.479-1.887 2.479z" fill="#252F3E"/>
          <path d="M55.098 40.013c0-1.813-.948-3.029-2.412-3.029-1.465 0-2.412 1.216-2.412 3.029 0 1.83.947 3.046 2.412 3.046 1.464 0 2.412-1.216 2.412-3.046zm-6.25 0c0-2.599 1.478-4.402 3.838-4.402 2.38 0 3.839 1.803 3.839 4.402 0 2.615-1.459 4.418-3.839 4.418-2.36 0-3.838-1.803-3.838-4.418z" fill="#252F3E"/>
          <path d="M60.095 36.984c-1.175 0-2.133.516-2.629 1.41h-.052v-1.18h-1.307v10.402h1.367v-3.762h.052c.391.725 1.231 1.168 2.347 1.168 1.957 0 3.132-1.516 3.132-4.029 0-2.513-1.176-4.009-2.91-4.009zm-.48 6.521c-1.109 0-1.803-.981-1.803-2.513 0-1.511.694-2.475 1.803-2.475 1.19 0 1.828.923 1.828 2.475 0 1.573-.638 2.513-1.828 2.513z" fill="#252F3E"/>
          <path d="M69.226 41.223c-.1-1.598-1.086-2.584-2.756-2.584-1.857 0-3.062 1.304-3.062 4.131 0 2.845 1.196 4.172 3.093 4.172 1.606 0 2.644-.95 2.826-2.505h-1.316c-.135.773-.627 1.225-1.49 1.225-1.136 0-1.727-1.046-1.727-2.892 0-1.81.582-2.85 1.707-2.85.899 0 1.387.57 1.48 1.303h1.245z" fill="#252F3E"/>
          <path d="M74.838 36.984c-2.04 0-3.291 1.51-3.291 3.99 0 2.521 1.264 4.011 3.291 4.011 2.04 0 3.29-1.489 3.29-4.011 0-2.48-1.25-3.99-3.29-3.99zm0 6.47c-1.248 0-1.886-1.053-1.886-2.479 0-1.407.638-2.458 1.886-2.458 1.246 0 1.886 1.051 1.886 2.458 0 1.426-.64 2.479-1.886 2.479z" fill="#252F3E"/>
          <path d="M84.436 37.214l-1.33 4.566h-.064l-1.375-4.566h-1.44l2.083 6.05-.148.372c-.284.766-.611.99-1.287.99-.178 0-.368-.017-.517-.042v1.216c.152.034.503.059.685.059 1.3 0 1.911-.531 2.376-1.906l2.383-6.739h-1.366z" fill="#252F3E"/>
          <path d="M119.531 40.978h5.393l-2.697-4.618-2.696 4.618zm-7.628 9.482l-3.283-2.311c-2.696 1.985-5.591 2.944-8.486 2.944-6.566 0-12.37-4.402-12.37-13.204 0-8.343 5.908-13.186 12.812-13.186 6.566 0 11.836 4.843 11.836 13.186 0 4.18-1.153 7.566-3.283 10.164l3.539 2.503-.765.904zm-42.166-8.802c-.533 0-.977.442-.977.974 0 .533.444.975.977.975.533 0 .976-.442.976-.975 0-.532-.443-.974-.976-.974zm-9.329-19.19c0-.533-.444-.975-.977-.975-.532 0-.977.442-.977.975 0 .532.445.975.977.975.533 0 .977-.443.977-.975zm21.865 6.134c.887-.266 2.837-1.149 2.837-3.68 0-2.507-1.61-4.167-3.96-4.167h-6.053v14.071h6.64c2.575 0 4.252-1.922 4.252-4.737 0-2.835-2.131-4.086-3.716-4.286v-.025-.075-.101zm-5.14-.583h2.863c1.284 0 2.104.942 2.104 2.33 0 1.366-.82 2.308-2.104 2.308h-2.863v-4.638zm0-6.158h2.508c1.178 0 1.922.785 1.922 2.016 0 1.273-.77 2.032-1.922 2.032h-2.508v-4.048zm27.005 15.47c6.592 0 11.949-5.309 11.949-11.845 0-6.537-5.357-11.845-11.949-11.845S93.188 15.637 93.188 22.174c0 6.536 5.358 11.845 11.95 11.845zm0-21.661c5.446 0 9.87 4.389 9.87 9.816 0 5.428-4.424 9.817-9.87 9.817s-9.87-4.389-9.87-9.817c0-5.427 4.424-9.816 9.87-9.816zm-32.645 21.661c6.592 0 11.95-5.309 11.95-11.845 0-6.537-5.358-11.845-11.95-11.845-6.591 0-11.949 5.308-11.949 11.845 0 6.536 5.358 11.845 11.949 11.845zm0-21.661c5.447 0 9.87 4.389 9.87 9.816 0 5.428-4.423 9.817-9.87 9.817-5.446 0-9.87-4.389-9.87-9.817 0-5.427 4.424-9.816 9.87-9.816zM14.008 49.162c-4.424 0-8.088-1.624-10.992-4.847-.24-.266-.026-.532.266-.685l3.207-1.942c.265-.158.532-.1.708.165 1.93 2.431 4.438 3.64 6.894 3.64 4.03 0 6.552-2.44 6.552-5.825 0-1.884-1.075-3.515-3.269-4.757-1.52-.86-3.447-1.6-5.293-2.323-1.84-.722-3.74-1.568-5.287-2.886C4.736 27.991 3.54 25.926 3.54 23.28c0-2.282.887-4.298 2.484-5.682 1.598-1.385 3.793-2.133 6.367-2.133 3.814 0 6.447 1.292 8.502 2.912.292.24.305.58.04.829L17.83 21.527c-.24.225-.559.237-.806.017-1.624-1.452-3.342-2.233-5.446-2.233-3.409 0-5.622 2.111-5.622 4.871 0 1.675.874 3.168 2.75 4.245 1.312.741 3.073 1.436 4.918 2.163 1.86.731 3.784 1.583 5.413 2.977 2.152 1.842 3.283 4.002 3.283 6.87 0 2.688-.967 5.043-2.75 6.661-1.783 1.618-4.272 2.515-7.562 2.515zm-5.14-20.546c-.532 0-.976.442-.976.974 0 .533.444.975.976.975s.977-.442.977-.975c0-.532-.445-.974-.977-.974z" fill="#FF9900"/>
        </svg>
      )
    },
    { 
      name: "Magento", 
      color: "#F46F25",
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 80" width="32" height="32">
          <path fill="#F46F25" d="M35 0l-5.4 3.125v59.027l5.4 3.083 5.4-3.083V3.125zM22.3 6.25L16.9 9.375v49.653l5.4 3.124 5.4-3.124V9.375zM47.7 6.25l-5.4 3.125v49.653l5.4 3.124 5.4-3.124V9.375zM53.1 62.152l5.4 3.124 5.4-3.124V12.5L58.5 9.375V56.25zM6.6 12.5v49.652l5.4 3.124 5.4-3.124V12.5L12 9.375zM0 18.75v43.402l5.4 3.125V15.625zM64.6 18.75v43.402l5.4 3.125V15.625z"/>
        </svg>
      )
    },
    { 
      name: "WordPress", 
      color: "#21759B",
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32">
          <path fill="#21759B" d="M128 0C57.29 0 0 57.29 0 128s57.29 128 128 128 128-57.29 128-128S198.71 0 128 0zM19.71 128c0-17.36 3.96-33.81 11.01-48.5l60.56 165.83C47.02 222.23 19.71 178.87 19.71 128zm108.29 108.04c-11.75 0-23.06-1.71-33.76-4.87l35.87-104.25 36.75 100.82.92 2.26c-12.48 3.93-25.84 6.04-39.78 6.04zm16.06-158.67c7.25-.38 13.77-1.14 13.77-1.14 6.47-.76 5.71-10.29-.76-9.91 0 0-19.47 1.53-32.05 1.53-11.82 0-31.67-1.53-31.67-1.53-6.48-.38-7.25 9.53-.76 9.91 0 0 6.14.76 12.62 1.14l18.77 51.49-26.39 79.1-43.95-130.59c7.25-.38 13.77-1.14 13.77-1.14 6.47-.76 5.71-10.29-.76-9.91 0 0-19.48 1.53-32.05 1.53-2.25 0-4.9-.06-7.73-.15 21.49-32.66 58.47-54.18 100.38-54.18 31.29 0 59.77 11.96 81.13 31.53-.51-.03-1.02-.1-1.54-.1-11.82 0-20.19 10.29-20.19 21.34 0 9.91 5.72 18.29 11.82 28.2 4.58 8.01 9.91 18.29 9.91 33.1 0 10.29-3.96 22.18-9.14 38.82l-12.02 40.14-43.41-129.05zm87.03-4.48c13.05 23.92 20.48 51.43 20.48 80.71 0 61.7-33.46 115.53-83.05 144.28l50.99-147.45c9.52-23.78 12.68-42.84 12.68-59.77 0-5.9-.38-11.36-1.1-16.77z"/>
        </svg>
      )
    },
    { 
      name: "ERC", 
      color: "#6E3CA3",
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32">
          <path fill="#6E3CA3" d="M32 0C14.327 0 0 14.327 0 32s14.327 32 32 32 32-14.327 32-32S49.673 0 32 0zm0 58C17.641 58 6 46.359 6 32S17.641 6 32 6s26 11.641 26 26-11.641 26-26 26z"/>
          <path fill="#6E3CA3" d="M42.5 21h-21a1.5 1.5 0 0 0-1.5 1.5v19a1.5 1.5 0 0 0 1.5 1.5h21a1.5 1.5 0 0 0 1.5-1.5v-19a1.5 1.5 0 0 0-1.5-1.5zM24 38h-1v-3h1v3zm0-6h-1v-3h1v3zm0-6h-1v-1h1v1zm7 12h-3v-1h3v1zm0-4h-3v-1h3v1zm0-4h-3v-1h3v1zm8 8h-5v-9h5v9z"/>
        </svg>
      )
    },
    { 
      name: "Shopify", 
      color: "#7AB55C",
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109.5 124.5" width="32" height="32">
          <path fill="#95BF47" d="M95.97 23.3c-.07-.67-.67-1.03-1.13-1.03-.47 0-9.39-.67-9.39-.67s-6.22-6.22-6.89-6.89c-.67-.67-1.93-.47-2.42-.33-.07 0-1.27.4-3.29 1.03-1.97-5.66-5.43-10.85-11.58-10.85h-.53c-1.73-2.26-3.93-3.3-5.79-3.3-14.26 0-21.08 17.9-23.22 27.01-5.53 1.73-9.46 2.93-9.99 3.1-3.09.97-3.19 1.07-3.59 3.99C17.5 38.34 9 109.5 9 109.5l72.5 13.53V23.1c-.2.13-.27.13-.27.13s-1.2.07-1.27.07zM67.12 19.31c-1.6.5-3.39 1.07-5.36 1.67v-1.13c0-3.59-.5-6.49-1.33-8.79 3.29.5 5.49 4.09 6.69 8.25zM56.7 11.62c.9 2.26 1.47 5.49 1.47 9.89v.67c-3.59 1.1-7.49 2.32-11.38 3.53 2.19-8.41 6.32-12.55 9.91-14.08zM48.88 4.37c.9 0 1.8.33 2.69.97-4.15 1.97-8.55 6.95-10.45 16.86-2.76.87-5.49 1.7-8.15 2.53 2.26-7.79 7.69-20.38 15.91-20.38z"/>
          <path fill="#5E8E3E" d="M94.84 22.27c-.47 0-9.39-.67-9.39-.67s-6.22-6.22-6.89-6.89c-.27-.27-.6-.37-.93-.37l-5.16 107.83 72.5-13.53S97.1 23.04 96.9 22.37c-.7-.67-.67-1.03-1.13-1.03-.13 0-.6.07-.93.93z"/>
          <path fill="#FFF" d="M58.43 39.5l-3.69 11c0 .07-.07.07-.13.07s-2.99-.33-6.55-.33c-5.29 0-8.95.67-9.02.7-.07 0-.13-.07-.13-.13l-4.96-9.49s4.36-1.37 9.12-2.86c3.33-1.03 6.62-2.03 9.82-3.03 1.33 2.33 3.39 4.03 5.53 4.03v.04zM51.7 22.08c0-.37-.07-.73-.07-1.13 0-3.59-.5-6.49-1.33-8.79-3.06-.4-6.42-.07-9.42 1.73 2.26-7.79 7.69-11.54 11.38-11.54.9 0 1.8.33 2.69.97-4.12 1.94-8.51 6.89-10.41 16.82l7.16 1.94z"/>
        </svg>
      )
    },
    { 
      name: "Wix", 
      color: "#0C6EFC",
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 135" width="92" height="32">
          <path d="M166.5 91.1L139.8 39h-12.8l-26.7 52.1L74.8 39H54l40.7 82.4h10.4l28.5-52 28.5 52h10.4L213.2 39h-20.7l-26 52.1zM356.8 39h-17.9v82.4h17.9V39zM336.8 19.4c0 6 4.9 10.9 10.9 10.9 6 0 10.9-4.9 10.9-10.9 0-6-4.9-10.9-10.9-10.9-6 0-10.9 4.9-10.9 10.9zM404.7 38c-9.1 0-17.1 2.4-23.6 7-6.2 4.3-10.6 10.4-13.1 18l-.2.6h19.5l.1-.3c1.6-4 4-7 7.3-9 3.2-1.9 7.1-2.9 11.5-2.9 4.6 0 8.4 1.1 11.3 3.3 2.9 2.2 4.4 5.1 4.4 8.8v3.8l-21.6 1.3c-9.6.6-17.3 2.9-22.7 6.8-5.7 4.2-8.5 10.2-8.5 18.2 0 7.5 2.5 13.5 7.4 17.8 4.9 4.3 11.6 6.4 19.7 6.4 5.7 0 10.8-1.1 15.2-3.2 4.4-2.1 7.9-5.3 10.4-9.3l.2 2.6v8.2h17.5V66.9c0-9.4-2.9-16.7-8.5-21.6-5.6-4.9-13.8-7.3-26.3-7.3zm18.5 45.7c0 5.5-2.2 10.2-6.5 13.7-4.1 3.4-9.4 5.2-15.6 5.2-3.7 0-6.8-.9-9.1-2.6-2.3-1.7-3.5-4-3.5-6.8 0-3.3 1.5-5.9 4.5-7.7 2.8-1.7 6.9-2.8 12.4-3.1l17.7-1.1v2.4h.1zM483.6 38c-9.1 0-17.1 2.4-23.6 7-6.2 4.3-10.6 10.4-13.1 18l-.2.6h19.5l.1-.3c1.6-4 4-7 7.3-9 3.2-1.9 7.1-2.9 11.5-2.9 4.6 0 8.4 1.1 11.3 3.3 2.9 2.2 4.4 5.1 4.4 8.8v3.8l-21.6 1.3c-9.6.6-17.3 2.9-22.7 6.8-5.7 4.2-8.5 10.2-8.5 18.2 0 7.5 2.5 13.5 7.4 17.8 4.9 4.3 11.6 6.4 19.7 6.4 5.7 0 10.8-1.1 15.2-3.2 4.4-2.1 7.9-5.3 10.4-9.3l.2 2.6v8.2h17.5V66.9c0-9.4-2.9-16.7-8.5-21.6-5.7-4.9-13.8-7.3-26.3-7.3zm18.4 45.7c0 5.5-2.2 10.2-6.5 13.7-4.1 3.4-9.4 5.2-15.6 5.2-3.7 0-6.8-.9-9.1-2.6-2.3-1.7-3.5-4-3.5-6.8 0-3.3 1.5-5.9 4.5-7.7 2.8-1.7 6.9-2.8 12.4-3.1l17.7-1.1v2.4h.1zM281 38c-8.4 0-15.6 2.6-21.2 7.7-5.3 4.8-8.2 11.3-8.5 19.1l-.1 1.2v.7c0 9.4 3.1 16.9 9.1 22.2 6 5.2 14.6 7.8 25.5 7.8 9.1 0 16.8-1.7 22.6-5.1l.3-.2V75.3l-.7.5c-2.7 1.8-5.8 3.2-9.3 4.3-3.2 1-6.5 1.5-9.9 1.5-5.8 0-10.2-1.3-13.1-3.8-2.9-2.5-4.4-6.2-4.6-11.1V66h39.9v-8.8c0-6.5-2.5-11.7-7.6-15.6-5-3.7-11.8-5.6-20.4-5.6zm-10.2 19.7c.6-3.3 2.1-5.9 4.6-7.8 2.5-1.9 5.7-2.8 9.4-2.8 3.6 0 6.5.9 8.6 2.8 2.1 1.8 3.3 4.4 3.6 7.8h-26.2z" fill="#0C6EFC"/>
          <path d="M35.9 69.5L0 121.5h26.4l20.7-27.9L70.6 39 35.9 69.5z" fill="#F4D144"/>
          <path d="M70.6 39L49.8 93.6l26.1 27.9h26.4L70.6 39z" fill="#1967D2"/>
          <path d="M0 39h26.4l44.2 82.5H44.5L0 39z" fill="#37A806"/>
        </svg>
      )
    }
  ];

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="parallax-element absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
          data-depth="0.3"
        ></div>
        <div 
          className="parallax-element absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
          data-depth="0.5"
        ></div>
      </div>

      {/* Small Grid Elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-6 text-sm font-medium animate-fade-in">
            Premium Software Development & Digital Marketing
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6 animate-fade-in delay-100">
            {t('hero.title')}
            <span className="block text-gradient">{t('hero.subtitle')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
            {t('hero.description') || "We create exceptional digital experiences through innovative software development, strategic marketing, and cutting-edge design."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
            <Link
              to="/contact"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to="/services"
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              {t('nav.services')}
            </Link>
          </div>
          
          {/* Trusted by logos */}
          <div className="mt-16 md:mt-24">
            <p className="text-sm text-muted-foreground mb-6 animate-fade-in delay-400">
              {t('partners.title') || "Certified Partners With Leading Platforms"}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-10 animate-fade-in delay-500">
              {partnerLogos.map((logo, index) => (
                <div 
                  key={logo.name} 
                  className="flex items-center justify-center hover:scale-110 transition-transform duration-300"
                  style={{ 
                    animationDelay: `${500 + (index * 100)}ms`,
                    opacity: 0,
                    animation: 'fadeInUp 0.6s ease forwards'
                  }}
                >
                  {logo.logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

