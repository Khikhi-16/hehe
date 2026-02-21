import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import NameEntryScreen from '@/components/NameEntryScreen.jsx';
import AvatarSelection from '@/components/AvatarSelection.jsx';
import CinematicDoor from '@/components/CinematicDoor.jsx';
import MainPartyHall from '@/components/MainPartyHall.jsx';
import ChocolateBalloonGame from '@/components/ChocolateBalloonGame.jsx';
import CakeCuttingExperience from '@/components/CakeCuttingExperience.jsx';
import SpinTheWheelGame from '@/components/SpinTheWheelGame.jsx';
import DanceFloor from '@/components/DanceFloor.jsx';
import NostalgiaFoodPlate from '@/components/NostalgiaFoodPlate.jsx';
import GiftSubmission from '@/components/GiftSubmission.jsx';
import TimeCapsule from '@/components/TimeCapsule.jsx';
import PublicDashboard from '@/components/PublicDashboard.jsx';
import ThankYouScreen from '@/components/ThankYouScreen.jsx';

const GuestJourneyRouter = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [guestData, setGuestData] = useState({
    id: null,
    name: '',
    avatar: null,
    scores: {}
  });

  const updateGuestData = (newData) => {
    setGuestData(prev => ({ ...prev, ...newData }));
  };

  const nextPhase = () => {
    setCurrentPhase(prev => prev + 1);
  };

  const navigateToPhase = (phaseId) => {
    setCurrentPhase(phaseId);
  };

  const handleLeaveParty = () => {
    // Reset state to start over
    setGuestData({ id: null, name: '', avatar: null, scores: {} });
    setCurrentPhase(1);
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 1:
        return (
          <NameEntryScreen 
            key="phase1" 
            onComplete={(data) => {
              updateGuestData(data);
              nextPhase();
            }} 
          />
        );
      case 2:
        return (
          <AvatarSelection 
            key="phase2" 
            guestData={guestData}
            onComplete={(data) => {
              updateGuestData(data);
              nextPhase();
            }} 
          />
        );
      case 3:
        return (
          <CinematicDoor 
            key="phase3" 
            guestData={guestData}
            onComplete={nextPhase} 
          />
        );
      case 4:
        return (
          <MainPartyHall 
            key="phase4" 
            guestId={guestData.id}
            guestName={guestData.name}
            guestAvatar={guestData.avatar}
            onNavigate={navigateToPhase}
          />
        );
      case 5:
        return (
          <ChocolateBalloonGame 
            key="phase5"
            guestId={guestData.id}
            guestName={guestData.name}
            onBack={() => navigateToPhase(4)}
          />
        );
      case 6:
        return (
          <CakeCuttingExperience 
            key="phase6"
            onComplete={() => navigateToPhase(4)}
          />
        );
      case 7:
        return (
          <SpinTheWheelGame 
            key="phase7"
            guestId={guestData.id}
            guestName={guestData.name}
            onBack={() => navigateToPhase(4)}
          />
        );
      case 8:
        return (
          <DanceFloor 
            key="phase8"
            onBack={() => navigateToPhase(4)}
          />
        );
      case 9:
        return (
          <NostalgiaFoodPlate 
            key="phase9"
            onBack={() => navigateToPhase(4)}
          />
        );
      case 10:
        return (
          <GiftSubmission 
            key="phase10"
            guestId={guestData.id}
            guestName={guestData.name}
            onBack={() => navigateToPhase(4)}
          />
        );
      case 11:
        return (
          <TimeCapsule 
            key="phase11"
            guestId={guestData.id}
            guestName={guestData.name}
            onBack={() => navigateToPhase(4)}
          />
        );
      case 12:
        return (
          <PublicDashboard 
            key="phase12"
            onBack={() => navigateToPhase(4)}
          />
        );
      case 13:
        return (
          <ThankYouScreen 
            key="phase13"
            guestId={guestData.id}
            guestName={guestData.name}
            guestAvatar={guestData.avatar}
            onLeave={handleLeaveParty}
          />
        );
      default:
        return (
          <div key="default" className="min-h-screen flex flex-col items-center justify-center bg-purple-900 text-white p-10">
            <h2 className="text-3xl font-bold mb-4">🚧 Under Construction</h2>
            <p className="mb-8">This party room isn't ready yet!</p>
            <button 
              onClick={() => navigateToPhase(4)}
              className="px-6 py-3 bg-pink-500 rounded-xl font-bold hover:bg-pink-600 transition-colors"
            >
              Back to Party Hall
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-black min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {renderPhase()}
      </AnimatePresence>
    </div>
  );
};

export default GuestJourneyRouter;
