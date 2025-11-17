import React, { useState } from 'react'
import imageService from '../features/images/imageService'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import "./UploadImagePage.css"

export default function UploadImagePage() {
    const [file, setFile] = useState(null)
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const clearForm = () => {
        setFile(null)
        setDescription('')
    }

    const goBack = () => {
        navigate(-1)
    }

    const submit = async (e) => {
        e.preventDefault()
        if (!file) return
        setLoading(true)

        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('description', description)

            const saved = await imageService.uploadImage(fd)
            navigate(`/image/${saved.id}`)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="upload-page">
                <div className="upload-container">

                    {}
                    <div className="upload-top-bar">
                        <button
                            type="button"
                            onClick={goBack}
                            className="upload-back-btn"
                        >
                            ← Back
                        </button>

                        <h1 className="upload-title">Upload Photo</h1>
                    </div>

                    <form onSubmit={submit} className="upload-form">

                        <div className="upload-area">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setFile(e.target.files?.[0] ?? null)}
                                className="upload-file-input"
                            />

                            <div className="upload-area-content">
                                <div className="upload-icon">📷</div>
                                <h3>Choose an image</h3>
                                <p>or drag & drop</p>
                            </div>
                        </div>

                        {file && (
                            <div className="upload-preview">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="upload-preview-image"
                                />

                                <div className="upload-file-info">
                                    <span>{file.name}</span>

                                    <button
                                        type="button"
                                        className="upload-cancel-btn"
                                        onClick={clearForm}
                                    >
                                        ✖ Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Add a description..."
                            className="upload-textarea"
                        />

                        <button
                            type="submit"
                            disabled={loading || !file}
                            className={`upload-submit ${loading ? 'loading' : ''}`}
                        >
                            {loading ? 'Uploading…' : 'Upload Photo'}
                        </button>

                    </form>
                </div>
            </main>
        </>
    )
}
