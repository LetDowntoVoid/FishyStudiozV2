// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Get elements
const showcase = document.getElementById('showcase');
const aboutGame = document.getElementById('about_game');

// Initially hide about_game
gsap.set(aboutGame, { display: 'none' });

// Main ScrollTrigger that handles the entire showcase scroll experience
ScrollTrigger.create({
  trigger: showcase,
  start: "top 90%", // When showcase is 10% into viewport
  end: "bottom 20%", // When showcase is 80% through viewport  
  pin: true,
  pinSpacing: false,
  onEnter: () => {
    gsap.set(aboutGame, { display: 'block' });
  },
  onLeave: () => {
    gsap.set(aboutGame, { display: 'none' });
  },
  onEnterBack: () => {
    gsap.set(aboutGame, { display: 'block' });
  },
  onLeaveBack: () => {
    gsap.set(aboutGame, { display: 'none' });
  }
});

// Content scrolling timeline (active during the pinned section)
const contentTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: showcase,
    start: "top 90%",
    end: "bottom 20%",
    scrub: 1
  }
});

// Add content scrolling animations
contentTimeline
  // Simulate content scrolling - add your specific content animations here
  .to('.about-content-1', { // Replace with your actual content selectors
    y: -100,
    duration: 0.5
  })
  .to('.about-content-2', {
    y: -100,
    duration: 0.5
  }, "-=0.3")
  .to('.about-content-2', {
    y: -200,
    duration: 0.5
  }, "+=0.3")
  .to('.about-content-3', {
    y: -100,
    duration: 0.5
  }, "-=0.3");

// Alternative approach: If you want discrete scroll steps instead of smooth scrubbing
/*
ScrollTrigger.create({
  trigger: showcase,
  start: "10% top",
  onEnter: () => {
    // Disable normal scrolling
    document.body.style.overflow = 'hidden';
    
    // Show about_game
    gsap.set(aboutGame, { display: 'block' });
    
    // Create content sequence
    const contentTimeline = gsap.timeline({
      onComplete: () => {
        // Re-enable scrolling and hide about_game
        document.body.style.overflow = 'auto';
        gsap.set(aboutGame, { display: 'none' });
      }
    });
    
    contentTimeline
      .to(aboutGame, { opacity: 1, duration: 0.5 })
      .to('.about-content-1', { y: -100, opacity: 0, duration: 1 }, "+=0.5")
      .to('.about-content-2', { y: 0, opacity: 1, duration: 1 }, "-=0.5")
      .to('.about-content-2', { y: -100, opacity: 0, duration: 1 }, "+=1")
      .to('.about-content-3', { y: 0, opacity: 1, duration: 1 }, "-=0.5")
      .to(aboutGame, { opacity: 0, duration: 0.5 }, "+=1");
  }
});
*/

// Refresh ScrollTrigger after DOM changes
ScrollTrigger.refresh()