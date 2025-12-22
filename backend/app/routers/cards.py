from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.init_data import DEFAULT_USER_ID, DEFAULT_PROJECT_ID
from app.models.card import Card
from app.schemas.card import CardCreate, CardUpdate, CardResponse

router = APIRouter(prefix="/cards", tags=["cards"], redirect_slashes=False)  # Добавили redirect_slashes=False

@router.get("", response_model=List[CardResponse])  # Убрали "/" оставили ""
def get_cards(db: Session = Depends(get_db)):
    """Получить все карточки дефолтного проекта"""
    cards = db.query(Card).filter(
        Card.project_id == DEFAULT_PROJECT_ID
    ).order_by(Card.status, Card.position).all()
    return cards

@router.post("", response_model=CardResponse, status_code=status.HTTP_201_CREATED)  # Убрали "/"
def create_card(card: CardCreate, db: Session = Depends(get_db)):
    """Создать новую карточку"""
    # Проверка на существование карточки с таким title
    existing = db.query(Card).filter(Card.title == card.title).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Card with title '{card.title}' already exists"
        )
    
    # Создание карточки
    db_card = Card(
        **card.model_dump(),
        project_id=DEFAULT_PROJECT_ID,
        user_id=DEFAULT_USER_ID
    )
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

@router.patch("/{title}", response_model=CardResponse)
def update_card(title: str, card_update: CardUpdate, db: Session = Depends(get_db)):
    """Обновить карточку (статус, приоритет, позицию, описание)"""
    db_card = db.query(Card).filter(Card.title == title).first()
    if not db_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with title '{title}' not found"
        )
    
    # Обновляем только те поля, которые переданы
    update_data = card_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_card, field, value)
    
    db.commit()
    db.refresh(db_card)
    return db_card

@router.delete("/{title}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(title: str, db: Session = Depends(get_db)):
    """Удалить карточку"""
    db_card = db.query(Card).filter(Card.title == title).first()
    if not db_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with title '{title}' not found"
        )
    
    db.delete(db_card)
    db.commit()
    return None