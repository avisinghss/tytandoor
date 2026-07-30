// src/components/admin/DashboardModals.jsx
import React from 'react';
import AddProductModal from './AddProductModal';
import AddStaffModal from './AddStaffModal';
import AddProjectModal from './AddProjectModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function DashboardModals({
  isAddProductOpen, setIsAddProductOpen, fetchProducts,
  isAddStaffOpen, setIsAddStaffOpen, fetchStaff,
  isAddProjectOpen, setIsAddProjectOpen, fetchProjects,
  deleteModal, setDeleteModal, onConfirmDelete
}) {
  return (
    <>
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductAdded={fetchProducts}
      />
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onStaffAdded={fetchStaff}
      />
      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onProjectAdded={fetchProjects}
      />
      <DeleteConfirmModal
        modalData={deleteModal}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}