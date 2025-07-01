"use client";

import React, { useState } from "react";
import { CreateRoomData, JoinRoomData } from "@/types/game";

interface HomePageProps {
  onCreateRoom: (data: CreateRoomData) => void;
  onJoinRoom: (data: JoinRoomData) => void;
  isLoading: boolean;
  isConnected: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onCreateRoom,
  onJoinRoom,
  isLoading,
  isConnected,
}) => {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [createForm, setCreateForm] = useState({
    roomName: "",
    playerName: "",
  });
  const [joinForm, setJoinForm] = useState({
    roomId: "",
    playerName: "",
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.roomName.trim() || !createForm.playerName.trim()) return;
    onCreateRoom(createForm);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinForm.roomId.trim() || !joinForm.playerName.trim()) return;
    onJoinRoom(joinForm);
  };

  const handlePasteRoomId = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJoinForm((prev) => ({ ...prev, roomId: text.trim() }));
    } catch (err) {
      // Fallback - show a message or do nothing
      console.warn("Failed to read clipboard:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">🎯 Bingo Game</h1>
          <p className="text-blue-100">Multiplayer • Real-time • Fun!</p>

          {/* Connection Status */}
          <div className="mt-4 flex items-center justify-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
            <span className="text-sm text-blue-100">
              {isConnected ? "Connected" : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              activeTab === "create"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              activeTab === "join"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Join Room
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {activeTab === "create" ? (
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={createForm.roomName}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      roomName: e.target.value,
                    }))
                  }
                  placeholder="Enter room name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                  required
                  disabled={isLoading || !isConnected}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={createForm.playerName}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      playerName: e.target.value,
                    }))
                  }
                  placeholder="Enter your name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                  required
                  disabled={isLoading || !isConnected}
                />
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !isConnected ||
                  !createForm.roomName.trim() ||
                  !createForm.playerName.trim()
                }
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {isLoading ? "Creating..." : "Create Room"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Room ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinForm.roomId}
                    onChange={(e) =>
                      setJoinForm((prev) => ({
                        ...prev,
                        roomId: e.target.value,
                      }))
                    }
                    placeholder="Paste room ID here..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                    required
                    disabled={isLoading || !isConnected}
                  />
                  <button
                    type="button"
                    onClick={handlePasteRoomId}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm font-bold"
                    disabled={isLoading || !isConnected}
                    title="Paste from clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={joinForm.playerName}
                  onChange={(e) =>
                    setJoinForm((prev) => ({
                      ...prev,
                      playerName: e.target.value,
                    }))
                  }
                  placeholder="Enter your name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                  required
                  disabled={isLoading || !isConnected}
                />
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !isConnected ||
                  !joinForm.roomId.trim() ||
                  !joinForm.playerName.trim()
                }
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {isLoading ? "Joining..." : "Join Room"}
              </button>
            </form>
          )}
        </div>

        {/* Game Rules */}
        <div className="bg-gray-50 p-4 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">🎮 How to Play:</h3>
          <ul className="space-y-1 text-xs">
            <li>• 2-4 players per room</li>
            <li>• Take turns marking numbers on your board</li>
            <li>• Get 5 complete lines to win!</li>
            <li>• Lines can be horizontal, vertical, or diagonal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
