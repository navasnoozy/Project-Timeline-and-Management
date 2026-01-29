"use client";

import { Box, Text, Flex, Input, IconButton, useBreakpointValue, Badge } from "@chakra-ui/react";
import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Deliverable, TaskStatus, getNextAvailableDate } from "./data";
import { DeliverableDuration } from "./DeliverableDuration";
import { StatusBadge } from "./StatusBadge";
import { AppButton } from "@/components/AppButton";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

interface DeliverablesListProps {
  deliverables: Deliverable[];
  onUpdate: (deliverables: Deliverable[]) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEditable?: boolean;
}

export const DeliverablesList = ({ deliverables, onUpdate, isExpanded, onToggleExpand, isEditable = false }: DeliverablesListProps) => {
  const [newDeliverable, setNewDeliverable] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Check if screen is large desktop (2xl+)
  const isLargeScreen = useBreakpointValue({ base: false, "2xl": true });
  // Default show all on large screens, or if expanded. Otherwise show top 2.
  const showAll = isLargeScreen || isExpanded;
  const visibleDeliverables = showAll ? deliverables : deliverables.slice(0, 2);
  const hiddenCount = deliverables.length - 2;
  const completedCount = deliverables.filter((d) => d.status === "Completed").length;

  const handleStatusChange = (id: string, status: TaskStatus) => {
    const updated = deliverables.map((d) => (d.id === id ? { ...d, status } : d));
    onUpdate(updated);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updated = deliverables.filter((d) => d.id !== deleteId);
      onUpdate(updated);
      setDeleteId(null);
    }
  };

  const handleAdd = () => {
    if (!newDeliverable.trim()) return;

    const nextStartDate = getNextAvailableDate(deliverables);

    const newItem: Deliverable = {
      id: `${Date.now()}`,
      text: newDeliverable.trim(),
      status: "Not Started",
      startDate: nextStartDate,
      durationDays: 7,
      excludeHolidays: true,
      excludeSaturdays: false,
    };
    onUpdate([...deliverables, newItem]);
    setNewDeliverable("");
    setIsAdding(false);
  };

  const handleDurationUpdate = (id: string, startDate: string, durationDays: number, options?: { excludeHolidays?: boolean; excludeSaturdays?: boolean }) => {
    const updated = deliverables.map((d) => (d.id === id ? { ...d, startDate, durationDays, ...options } : d));
    onUpdate(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    } else if (e.key === "Escape") {
      setNewDeliverable("");
      setIsAdding(false);
    }
  };

  return (
    <Box mt={2} bg="gray.50" p={1.5} borderRadius="md">
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="xs" fontWeight="bold" color="gray.500">
          KEY DELIVERABLES
        </Text>
        <Flex align="center" gap={2}>
          {/* Progress badge */}
          {deliverables.length > 0 && (
            <Badge colorPalette="green" variant="subtle" fontSize="2xs">
              <Check size={10} style={{ marginRight: "2px" }} />
              {completedCount}/{deliverables.length}
            </Badge>
          )}
          {isEditable && !isAdding && (
            <IconButton aria-label="Add deliverable" size="xs" variant="ghost" colorPalette="blue" onClick={() => setIsAdding(true)}>
              <Plus size={14} />
            </IconButton>
          )}
        </Flex>
      </Flex>

      {/* Deliverables List */}
      <Flex direction="column" gap={1}>
        <AnimatePresence mode="popLayout">
          {visibleDeliverables.map((d) => (
            <motion.div key={d.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
              <Box
                key={d.id}
                bg="white"
                py={{ base: 1.5, md: 1, "2xl": 1.5 }}
                px={2}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
                css={{
                  "& .delete-btn": { opacity: 0, transition: "opacity 0.2s" },
                  "&:hover .delete-btn": { opacity: 1 },
                }}
              >
                {/* Row 1: Name + Delete */}
                <Flex justify="space-between" align="flex-start" gap={2}>
                  <Text fontSize="xs" fontWeight="medium" flex={1} textDecoration={d.status === "Completed" ? "line-through" : "none"} color={d.status === "Completed" ? "gray.400" : "gray.700"}>
                    {d.text}
                  </Text>
                  {isEditable && (
                    <IconButton className="delete-btn" aria-label="Delete deliverable" size="xs" variant="ghost" colorPalette="red" onClick={() => setDeleteId(d.id)}>
                      <Trash2 size={12} />
                    </IconButton>
                  )}
                </Flex>

                {/* Row 2: Status + Duration */}
                <Flex justify="space-between" align="center" mt={1.5} flexWrap="wrap" gap={1}>
                  <StatusBadge status={d.status} onStatusChange={(status) => isEditable && handleStatusChange(d.id, status)} />
                  <DeliverableDuration
                    deliverable={d}
                    allDeliverables={deliverables}
                    onUpdate={(startDate, durationDays, options) => handleDurationUpdate(d.id, startDate, durationDays, options)}
                    isEditable={isEditable}
                  />
                </Flex>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add New Input */}
        {isAdding && (
          <Flex align="center" gap={2} mt={1}>
            <Input size="sm" placeholder="New deliverable..." value={newDeliverable} onChange={(e) => setNewDeliverable(e.target.value)} onKeyDown={handleKeyDown} autoFocus />
            <IconButton aria-label="Save" size="xs" colorPalette="green" onClick={handleAdd} disabled={!newDeliverable.trim()}>
              <Plus size={14} />
            </IconButton>
          </Flex>
        )}

        {/* Empty state */}
        {deliverables.length === 0 && !isAdding && (
          <Text fontSize="xs" color="gray.400" textAlign="center" py={2}>
            No deliverables yet. Click + to add.
          </Text>
        )}
        {/* Show More / Show Less Button - Only for Laptop/Tablet screens */}
        {!isLargeScreen && deliverables.length > 2 && (
          <Flex
            as="button"
            onClick={onToggleExpand}
            align="center"
            justify="center"
            gap={1}
            mt={1}
            py={1.5}
            borderRadius="md"
            bg={isExpanded ? "purple.50" : "gray.100"}
            color={isExpanded ? "purple.600" : "gray.600"}
            fontSize="xs"
            fontWeight="medium"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: isExpanded ? "purple.100" : "gray.200" }}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={12} />
              </>
            ) : (
              <>
                +{hiddenCount} more items <ChevronDown size={12} />
              </>
            )}
          </Flex>
        )}
      </Flex>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Deliverable"
        message="Are you sure you want to delete this key deliverable? This action cannot be undone."
        confirmText="Delete"
        confirmColorPalette="red"
      />
    </Box>
  );
};
