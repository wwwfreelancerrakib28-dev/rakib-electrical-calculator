      {/* COMPACT DROPDOWN ROOM SELECTOR */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
              রুম নির্বাচন করুন:
            </span>
            <span className="text-xs font-black text-slate-800 dark:text-white">
              মোট {project.rooms.length}টি রুম উপলব্ধ
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRoomId || ''}
            onChange={(e) => handleSelectRoomAndBringToFront(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm"
          >
            {project.rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {getRoomEmoji(room.type)} {room.name} ({formatWatts(room.totalWatts)})
              </option>
            ))}
          </select>

          <button
            onClick={openCreateRoomModal}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>নতুন রুম</span>
          </button>
        </div>
      </div>
