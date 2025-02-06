class RecipeDocumentManager {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        this.files = new Map();
        this.initializeFromStorage();
        this.setupEventListeners();
    }

    initializeFromStorage() {
        // Load saved file metadata from localStorage
        const savedFiles = JSON.parse(localStorage.getItem('recipeFiles') || '[]');
        savedFiles.forEach(fileInfo => {
            const storedFile = localStorage.getItem(`file_${fileInfo.id}`);
            if (storedFile) {
                this.files.set(fileInfo.id, {
                    metadata: fileInfo,
                    content: storedFile
                });
            }
        });
        this.updateFileList();
    }

    setupEventListeners() {
        const uploadSection = document.getElementById('uploadSection');
        const fileInput = document.getElementById('fileInput');

        // File input change handler
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Drag and drop handlers
        uploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadSection.classList.add('drag-over');
        });

        uploadSection.addEventListener('dragleave', () => {
            uploadSection.classList.remove('drag-over');
        });

        uploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadSection.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        // Delegate click events for file actions
        document.getElementById('fileList').addEventListener('click', (e) => {
            const fileId = e.target.closest('.file-item')?.dataset.fileId;
            if (!fileId) return;

            if (e.target.classList.contains('btn-preview')) {
                this.previewFile(fileId);
            } else if (e.target.classList.contains('btn-delete')) {
                this.deleteFile(fileId);
            }
        });

        // Close preview modal
        document.querySelector('.close-preview')?.addEventListener('click', () => {
            document.getElementById('previewModal').style.display = 'none';
        });
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (!this.validateFile(file)) return;
            
            const fileId = Date.now().toString();
            const reader = new FileReader();

            reader.onload = (e) => {
                const fileInfo = {
                    id: fileId,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified
                };

                // Store file metadata and content
                this.files.set(fileId, {
                    metadata: fileInfo,
                    content: e.target.result
                });

                // Save to localStorage
                this.saveToStorage(fileId, fileInfo, e.target.result);
                this.updateFileList();
                this.showMessage('File uploaded successfully!', 'success');
            };

            reader.onerror = () => {
                this.showMessage('Error reading file!', 'error');
            };

            reader.readAsDataURL(file);
        });
    }

    validateFile(file) {
        if (!this.allowedTypes.includes(file.type)) {
            this.showMessage('Invalid file type. Please upload PDF, DOCX, or TXT files.', 'error');
            return false;
        }

        if (file.size > this.maxFileSize) {
            this.showMessage('File size exceeds 5MB limit.', 'error');
            return false;
        }

        return true;
    }

    saveToStorage(fileId, fileInfo, content) {
        // Save file metadata
        const savedFiles = JSON.parse(localStorage.getItem('recipeFiles') || '[]');
        savedFiles.push(fileInfo);
        localStorage.setItem('recipeFiles', JSON.stringify(savedFiles));

        // Save file content
        localStorage.setItem(`file_${fileId}`, content);
    }

    deleteFile(fileId) {
        // Remove from Map
        this.files.delete(fileId);

        // Remove from localStorage
        const savedFiles = JSON.parse(localStorage.getItem('recipeFiles') || '[]');
        const updatedFiles = savedFiles.filter(file => file.id !== fileId);
        localStorage.setItem('recipeFiles', JSON.stringify(updatedFiles));
        localStorage.removeItem(`file_${fileId}`);

        this.updateFileList();
        this.showMessage('File deleted successfully!', 'success');
    }

    previewFile(fileId) {
        const file = this.files.get(fileId);
        if (!file) return;

        const previewModal = document.getElementById('previewModal');
        const previewContent = document.getElementById('previewContent');

        if (file.metadata.type === 'text/plain') {
            // For text files, display content directly
            fetch(file.content)
                .then(response => response.text())
                .then(text => {
                    previewContent.innerHTML = `<pre>${text}</pre>`;
                });
        } else {
            // For PDF and DOCX, provide download link
            previewContent.innerHTML = `
                <p>Preview not available for ${file.metadata.type} files.</p>
                <a href="${file.content}" download="${file.metadata.name}">Download ${file.metadata.name}</a>
            `;
        }

        previewModal.style.display = 'block';
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        this.files.forEach((file, fileId) => {
            const fileItem = document.createElement('li');
            fileItem.className = 'file-item';
            fileItem.dataset.fileId = fileId;

            const fileIcon = this.getFileIcon(file.metadata.type);
            const fileSize = this.formatFileSize(file.metadata.size);

            fileItem.innerHTML = `
                <div class="file-info">
                    <span class="file-icon">${fileIcon}</span>
                    <span class="file-name">${file.metadata.name}</span>
                    <span class="file-size">${fileSize}</span>
                </div>
                <div class="file-actions">
                    <button class="btn btn-preview">Preview</button>
                    <button class="btn btn-delete">Delete</button>
                </div>
            `;

            fileList.appendChild(fileItem);
        });
    }

    getFileIcon(fileType) {
        switch (fileType) {
            case 'application/pdf':
                return '📄';
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return '📝';
            case 'text/plain':
                return '📃';
            default:
                return '📎';
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showMessage(message, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.className = `${type}-message`;
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = '';
        }, 3000);
    }
}

// Initialize the document manager when the page loads
window.addEventListener('load', () => {
    new RecipeDocumentManager();
});
