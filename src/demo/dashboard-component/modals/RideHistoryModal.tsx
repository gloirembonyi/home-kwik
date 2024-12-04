import React from 'react';
import Modal from "@/components/ui/base/modal/Modal";
import ModalContent from "@/components/ui/base/modal/ModalContent";
import ModalHeader from "@/components/ui/base/modal/ModalHeader";
import ModalTitle from "@/components/ui/base/modal/ModalTitle";
import ModalCloseButton from "@/components/ui/base/modal/ModalCloseButton";

interface RideHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyData: RideHistory[];
}

interface RideHistory {
  id: string;
  date: string;
  distance: number;
  fare: number;
  status: string;
}

const RideHistoryModal: React.FC<RideHistoryModalProps> = ({ isOpen, onClose, historyData }) => (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Ride History</ModalTitle>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <div className="p-4 space-y-4">
          {historyData.length ? (
            historyData.map((ride) => (
              <div key={ride.id} className="border-b pb-2 mb-2">
                <p>Date: {ride.date}</p>
                <p>Distance: {ride.distance} km</p>
                <p>Fare: ${ride.fare.toFixed(2)}</p>
                <p>Status: {ride.status}</p>
              </div>
            ))
          ) : (
            <p>No ride history available.</p>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
  
  export default RideHistoryModal;