"""
Storage Module
Handles content tracking and persistence
"""

import json
import os
from typing import List, Set, Dict, Optional
from datetime import datetime
from pathlib import Path


class ContentStorage:
    """Simple file-based storage for tracking processed content"""
    
    def __init__(self, storage_dir: str = "storage"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)
        self.processed_file = self.storage_dir / "processed_content.json"
        self.microlearnings_dir = self.storage_dir / "microlearnings"
        self.microlearnings_dir.mkdir(exist_ok=True)
        
        self.processed_hashes: Set[str] = self._load_processed_hashes()
    
    def _load_processed_hashes(self) -> Set[str]:
        """Load previously processed content hashes"""
        if self.processed_file.exists():
            try:
                with open(self.processed_file, "r") as f:
                    data = json.load(f)
                    return set(data.get("processed_hashes", []))
            except Exception as e:
                print(f"Error loading processed hashes: {e}")
                return set()
        return set()
    
    def _save_processed_hashes(self):
        """Save processed content hashes to disk"""
        try:
            data = {
                "processed_hashes": list(self.processed_hashes),
                "last_updated": datetime.now().isoformat()
            }
            with open(self.processed_file, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving processed hashes: {e}")
    
    def is_processed(self, content_hash: str) -> bool:
        """Check if content has been processed"""
        return content_hash in self.processed_hashes
    
    def mark_as_processed(self, content_hash: str):
        """Mark content as processed"""
        self.processed_hashes.add(content_hash)
        self._save_processed_hashes()
    
    def save_microlearning(self, content_hash: str, microlearning: Dict) -> str:
        """Save a microlearning to disk"""
        filename = f"{content_hash}.json"
        filepath = self.microlearnings_dir / filename
        
        with open(filepath, "w") as f:
            json.dump(microlearning, f, indent=2, ensure_ascii=False)
        
        return str(filepath)
    
    def get_microlearning(self, content_hash: str) -> Optional[Dict]:
        """Retrieve a saved microlearning"""
        filename = f"{content_hash}.json"
        filepath = self.microlearnings_dir / filename
        
        if filepath.exists():
            try:
                with open(filepath, "r") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading microlearning: {e}")
                return None
        return None

