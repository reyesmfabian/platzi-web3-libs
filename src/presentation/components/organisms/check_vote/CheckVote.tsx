import {
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { mainStore } from "../../../../data/stores/main_store";
import { VotingService } from "../../../../domain/services/voting_service";

export function CheckVote() {
  const { selectedLibrary } = mainStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const service = new VotingService(selectedLibrary.gateway);
  const [checkAddress, setCheckAddress] = useState("");
  const [checkResult, setCheckResult] = useState(
    "This address has no registered vote"
  );
  const handleAddressChange = (event) => {
    setCheckAddress(event.target.value);
  };

  async function checkAddressVote() {
    try {
      if (checkAddress.length <= 0) {
        throw { message: "Please enter the address" };
      }
      const result = await service.getVote(checkAddress);
      switch (result) {
        case "1":
          setCheckResult("This address vote NO");
          break;
        case "2":
          setCheckResult("This address vote YES");
          break;
        default:
          break;
      }
      onOpen();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  return (
    <div className="col col-5 mx-auto">
      <h2 className="text-center my-4 fw-bold">Check address vote</h2>
      <Input
        className="text-center"
        placeholder="Enter address"
        onChange={handleAddressChange}
        value={checkAddress}
      />
      <Button
        className="my-4"
        colorScheme="green"
        onClick={() => checkAddressVote()}
      >
        Check Vote
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Check Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h2 className="text-center fw-bold">
              {checkResult}
            </h2>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
