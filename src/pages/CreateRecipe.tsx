import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Video, X, Upload, Edit } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import VoiceAssistant from '../components/VoiceAssistant';

interface FileInfo {
    id: string;
    name: string;
    type: string;
    size: number;
    lastModified: number;
    content: string;
}

interface UploadSectionProps {
    isDragActive: boolean;
}

const Container = styled.div`
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const UploadSection = styled.div<UploadSectionProps>`
    background-color: ${props => props.isDragActive ? '#e0e0e0' : '#f0f0f0'};
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
        background-color: #e0e0e0;
    }
`;

const UploadButton = styled.button`
    background-color: #4CAF50;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #3e8e41;
    }
`;

interface MessageProps {
    type: 'success' | 'error';
}

const Message = styled.div<MessageProps>`
    background-color: ${(props) => (props.type === 'success' ? '#dff0d8' : '#f2dede')};
    color: ${(props) => (props.type === 'success' ? '#3c763d' : '#a94442')};
    padding: 10px;
    border: 1px solid ${(props) => (props.type === 'success' ? '#d6e9c6' : '#ebccd1')};
    border-radius: 5px;
    margin-bottom: 10px;
`;

const FileList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const FileItem = styled.li`
    background-color: #f9f9f9;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const FileInfo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const FileIcon = styled.span`
    font-size: 24px;
    margin-right: 10px;
`;

const FileName = styled.span`
    font-size: 18px;
    font-weight: bold;
`;

const FileSize = styled.span`
    font-size: 14px;
    color: #666;
`;

const FileActions = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`;

interface ActionButtonProps {
    isDelete?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
    background-color: #4CAF50;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #3e8e41;
    }
    ${(props) => props.isDelete && background-color: #e74c3c; &:hover { background-color: #c0392b; }}
`;

const PreviewModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PreviewContent = styled.div`
    background-color: #f9f9f9;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    width: 80%;
    max-height: 80%;
    overflow-y: auto;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #4CAF50;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #3e8e41;
    }
`;

const ToggleContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
`;

interface ToggleButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const ToggleButton = styled.button<Pick<ToggleButtonProps, 'active'>>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s ease;
    flex: 1;
    
    ${props => props.active ? `
        background-color: #3498db;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    ` : `
        background-color: white;
        color: #666;
        border: 1px solid #ddd;
        
        &:hover {
            background-color: #f0f0f0;
        }
    `}
`;

const CreateRecipe: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [isUploadMode, setIsUploadMode] = useState(true);
    const [ingredients, setIngredients] = useState(['']);
    const [instructions, setInstructions] = useState(['']);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [servings, setServings] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [imageUrl, setImageUrl] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<Map<string, FileInfo>>(new Map());
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [previewFile, setPreviewFile] = useState<FileInfo | null>(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];

    const addIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const removeInstruction = (index: number) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const updateInstruction = (index: number, value: string) => {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (limit to 50MB)
            if (file.size > 50 * 1024 * 1024) {
                alert('Video size must be less than 50MB');
                return;
            }
            
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoPreviewUrl(url);
        }
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreviewUrl('');
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            // Create recipe object
            const recipe = {
                id: crypto.randomUUID(),
                title,
                description,
                ingredients: ingredients.filter(i => i.trim()),
                instructions: instructions.filter(i => i.trim()),
                cookingTime: parseInt(cookingTime),
                servings: parseInt(servings),
                difficulty,
                category: 'general',
                cuisine: 'various',
                imageUrl,
                videoUrl: videoPreviewUrl,
                authorId: user.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Get existing recipes from local storage
            const existingRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
            
            // Add new recipe
            localStorage.setItem('recipes', JSON.stringify([recipe, ...existingRecipes]));

            navigate('/profile');
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    };

    const validateFile = (file: File): boolean => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            setMessage({ text: 'Invalid file type. Please upload PDF, DOCX, or TXT files.', type: 'error' });
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            setMessage({ text: 'File size exceeds 5MB limit.', type: 'error' });
            return false;
        }

        return true;
    };

    const saveToStorage = (fileInfo: FileInfo) => {
        const savedFiles = JSON.parse(localStorage.getItem('recipeFiles') || '[]');
        savedFiles.push(fileInfo);
        localStorage.setItem('recipeFiles', JSON.stringify(savedFiles));
        localStorage.setItem(file_${fileInfo.id}, fileInfo.content);
    };

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            if (!validateFile(file)) return;

            const reader = new FileReader();
            reader.onload = () => {
                const fileId = Date.now().toString();
                const fileInfo: FileInfo = {
                    id: fileId,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    content: reader.result as string
                };

                setFiles(prev => {
                    const newFiles = new Map(prev);
                    newFiles.set(fileId, fileInfo);
                    return newFiles;
                });

                saveToStorage(fileInfo);
                setMessage({ text: 'File uploaded successfully!', type: 'success' });
            };

            reader.onerror = () => {
                setMessage({ text: 'Error reading file!', type: 'error' });
            };

            reader.readAsDataURL(file);
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        }
    });

    const deleteFile = (fileId: string) => {
        setFiles(prev => {
            const newFiles = new Map(prev);
            newFiles.delete(fileId);
            return newFiles;
        });

        const savedFiles = JSON.parse(localStorage.getItem('recipeFiles') || '[]');
        const updatedFiles = savedFiles.filter((file: FileInfo) => file.id !== fileId);
        localStorage.setItem('recipeFiles', JSON.stringify(updatedFiles));
        localStorage.removeItem(file_${fileId});

        setMessage({ text: 'File deleted successfully!', type: 'success' });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return ${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]};
    };

    const getFileIcon = (fileType: string): string => {
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
    };

    const handleVoiceTranscript = (transcript: string) => {
        const lowerTranscript = transcript.toLowerCase();
        
        // Handle title
        if (lowerTranscript.includes('title is') || lowerTranscript.includes('set title to')) {
            const titleMatch = transcript.match(/(?:title is|set title to) (.*)/i);
            if (titleMatch) {
                setTitle(titleMatch[1]);
            }
        }
        // Handle description
        else if (lowerTranscript.includes('description is') || lowerTranscript.includes('set description to')) {
            const descMatch = transcript.match(/(?:description is|set description to) (.*)/i);
            if (descMatch) {
                setDescription(descMatch[1]);
            }
        }
        // Handle ingredients
        else if (lowerTranscript.includes('add ingredient')) {
            const ingredientMatch = transcript.match(/add ingredient (.*)/i);
            if (ingredientMatch) {
                setIngredients(prev => [...prev, ingredientMatch[1]]);
            }
        }
        // Handle instructions
        else if (lowerTranscript.includes('add step') || lowerTranscript.includes('add instruction')) {
            const instructionMatch = transcript.match(/add (?:step|instruction) (.*)/i);
            if (instructionMatch) {
                setInstructions(prev => [...prev, instructionMatch[1]]);
            }
        }
        // Handle cooking time
        else if (lowerTranscript.includes('cooking time is') || lowerTranscript.includes('set cooking time to')) {
            const timeMatch = transcript.match(/(?:cooking time is|set cooking time to) (\d+)/i);
            if (timeMatch) {
                setCookingTime(timeMatch[1]);
            }
        }
        // Handle servings
        else if (lowerTranscript.includes('servings is') || lowerTranscript.includes('set servings to')) {
            const servingsMatch = transcript.match(/(?:servings is|set servings to) (\d+)/i);
            if (servingsMatch) {
                setServings(servingsMatch[1]);
            }
        }
        // Handle difficulty
        else if (lowerTranscript.includes('difficulty is') || lowerTranscript.includes('set difficulty to')) {
            const difficultyMatch = transcript.match(/(?:difficulty is|set difficulty to) (easy|medium|hard)/i);
            if (difficultyMatch) {
                setDifficulty(difficultyMatch[1].toLowerCase());
            }
        }
    };

    return (
        <>
            <VoiceAssistant onTranscript={handleVoiceTranscript} />
            <Container>
                <Title>🍳 Create New Recipe</Title>
                
                <ToggleContainer>
                    <ToggleButton 
                        active={isUploadMode} 
                        onClick={() => setIsUploadMode(true)}
                    >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Recipe Document
                    </ToggleButton>
                    <ToggleButton 
                        active={!isUploadMode} 
                        onClick={() => setIsUploadMode(false)}
                    >
                        <Edit className="w-5 h-5 mr-2" />
                        Create Recipe Manually
                    </ToggleButton>
                </ToggleContainer>

                {isUploadMode ? (
                    // Document Upload Section
                    <>
                        <UploadSection {...getRootProps()} isDragActive={isDragActive}>
                            <h2>Upload Recipe Document</h2>
                            <p>Drag and drop your recipe document here or click to select</p>
                            <input {...getInputProps()} />
                            <UploadButton type="button">Choose File</UploadButton>
                            <p>Supported formats: PDF, DOCX, TXT (Max size: 5MB)</p>
                        </UploadSection>

                        {message && (
                            <Message type={message.type}>
                                {message.text}
                            </Message>
                        )}

                        <h2>Uploaded Documents</h2>
                        <FileList>
                            {Array.from(files.values()).map(file => (
                                <FileItem key={file.id}>
                                    <FileInfo>
                                        <FileIcon>{getFileIcon(file.type)}</FileIcon>
                                        <FileName>{file.name}</FileName>
                                        <FileSize>{formatFileSize(file.size)}</FileSize>
                                    </FileInfo>
                                    <FileActions>
                                        <ActionButton onClick={() => setPreviewFile(file)}>
                                            Preview
                                        </ActionButton>
                                        <ActionButton onClick={() => deleteFile(file.id)} isDelete>
                                            Delete
                                        </ActionButton>
                                    </FileActions>
                                </FileItem>
                            ))}
                        </FileList>

                        {previewFile && (
                            <PreviewModal>
                                <PreviewContent>
                                    <CloseButton onClick={() => setPreviewFile(null)}>&times;</CloseButton>
                                    <div>
                                        {previewFile.type === 'text/plain' ? (
                                            <pre>{atob(previewFile.content.split(',')[1])}</pre>
                                        ) : (
                                            <div>
                                                <p>Preview not available for {previewFile.type} files.</p>
                                                <a href={previewFile.content} download={previewFile.name}>
                                                    Download {previewFile.name}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </PreviewContent>
                            </PreviewModal>
                        )}
                    </>
                ) : (
                    // Manual Recipe Creation Form
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recipe Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter recipe title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Describe your recipe"
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cooking Time (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={cookingTime}
                                        onChange={(e) => setCookingTime(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Servings
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={servings}
                                        onChange={(e) => setServings(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty
                                    </label>
                                    <select
                                        required
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ingredients
                                </label>
                                <div className="space-y-2">
                                    {ingredients.map((ingredient, index) => (
                                        <div key={index} className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={ingredient}
                                                onChange={(e) => updateIngredient(index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter ingredient"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                                className="p-2 text-red-500 hover:text-red-700"
                                            >
                                                <Minus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addIngredient}
                                    className="mt-2 flex items-center space-x-2 text-orange-500 hover:text-orange-700"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Add Ingredient</span>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instructions
                                </label>
                                <div className="space-y-2">
                                    {instructions.map((instruction, index) => (
                                        <div key={index} className="flex space-x-2">
                                            <textarea
                                                value={instruction}
                                                onChange={(e) => updateInstruction(index, e.target.value)}
                                                rows={2}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                placeholder="Enter instruction step"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeInstruction(index)}
                                                className="p-2 text-red-500 hover:text-red-700"
                                            >
                                                <Minus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addInstruction}
                                    className="mt-2 flex items-center space-x-2 text-orange-500 hover:text-orange-700"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Add Instruction</span>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recipe Image URL
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter image URL"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recipe Video (Optional)
                                </label>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                            ref={videoInputRef}
                                            className="hidden"
                                            id="video-upload"
                                        />
                                        <label
                                            htmlFor="video-upload"
                                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                                        >
                                            <Video className="h-5 w-5" />
                                            <span>Upload Video</span>
                                        </label>
                                        {videoPreviewUrl && (
                                            <button
                                                type="button"
                                                onClick={removeVideo}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    {videoPreviewUrl && (
                                        <div className="relative rounded-lg overflow-hidden">
                                            <video
                                                src={videoPreviewUrl}
                                                controls
                                                className="w-full"
                                                style={{ maxHeight: '400px' }}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Create Recipe
                            </button>
                        </form>
                    </div>
                )}
            </Container>
        </>
    );
};

export default CreateRecipe;