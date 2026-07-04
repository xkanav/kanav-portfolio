"""
Goofspiel Bot — Face Card Aware Strategy

Bidding logic:
    Prize 1-4   → bid our lowest available card
    Prize 5-9   → bid a random card from our hand in range 5-9
    Prize 10    → bid Jack (11) if available, else lowest
    Prize 11    → bid Queen (12) if available, else lowest
    Prize 12    → if Queen appears FIRST (before King), bid King (13)
                  if King already spent, bid lowest available
    Prize 13    → if King hasn't been used yet, bid King (13)
                  if Queen came before King (already spent 13), bid lowest
"""

import random


class Player:
    def __init__(self):
        self.hand: list[int] = list(range(1, 14))

        # Track whether Queen (12) prize appeared before King (13) prize
        self.queen_prize_seen: bool = False
        self.king_prize_seen:  bool = False

    def _update_prize_history(self, history: list[tuple[int, int, int]]):
        """Track whether Queen (12) or King (13) prize has appeared yet."""
        self.queen_prize_seen = False
        self.king_prize_seen  = False
        for prize, _, _ in history:
            if prize == 12:
                self.queen_prize_seen = True
            if prize == 13:
                self.king_prize_seen = True

    def _bid_lowest(self) -> int:
        return min(self.hand)

    def _bid_random_mid(self) -> int:
        """Bid a random card from 5-9 that we still have. Fallback to lowest."""
        mid_cards = [c for c in self.hand if 5 <= c <= 9]
        if mid_cards:
            return random.choice(mid_cards)
        return self._bid_lowest()

    def _bid_card(self, target: int) -> int:
        """Bid a specific target card if available, else fallback to lowest."""
        if target in self.hand:
            return target
        return self._bid_lowest()

    def _decide_bid(self, prize: int) -> int:

        # --- LOW prizes (1-4) ---
        # Never worth a real card
        if prize <= 4:
            return self._bid_lowest()

        # --- MID prizes (5-9) ---
        # Random from our 5-9 range to stay unpredictable
        elif prize <= 9:
            return self._bid_random_mid()

        # --- Prize 10 → bid Jack (11) ---
        elif prize == 10:
            return self._bid_card(11)

        # --- Prize 11 (Jack) → bid Queen (12) ---
        elif prize == 11:
            return self._bid_card(12)

        # --- Prize 12 (Queen) ---
        # If Queen prize appears first (before King prize) → bid King (13)
        # If King already spent (queen_prize_seen was handled, king gone) → lowest
        elif prize == 12:
            if not self.king_prize_seen:
                # Queen came first — go King
                return self._bid_card(13)
            else:
                # King prize already came and went — bid lowest
                return self._bid_lowest()

        # --- Prize 13 (King) ---
        # If King comes first (queen not yet seen) → match with King (13)
        # If Queen came before King → we already spent 13, bid lowest
        elif prize == 13:
            if not self.queen_prize_seen:
                # King came first — match it
                return self._bid_card(13)
            else:
                # Queen came first, we already burned 13 on it → lowest
                return self._bid_lowest()

        # Fallback
        return self._bid_lowest()

    def forward(self, prize: int, history: list[tuple[int, int, int]]) -> int:
        """
        Decide which card to bid this round.

        Args:
            prize:   the prize card revealed this round (1..13).
            history: list of past rounds (prize, your_bid, opponent_bid).

        Returns:
            An integer card from self.hand to bid this round.
        """
        # Update face card prize tracking
        self._update_prize_history(history)

        # Decide bid
        bid = self._decide_bid(prize)

        # Safety fallback
        if bid not in self.hand:
            bid = min(self.hand)

        ##### DO NOT CHANGE #####
        self.hand.remove(bid)
        return bid
