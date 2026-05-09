from django.db import models


class DestinationCatalog(models.Model):
    """
    Pre-seeded catalog of popular travel destinations with rich metadata
    for search, filtering, and discovery features.
    """
    
    # Basic Information
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    region = models.CharField(max_length=100, help_text="e.g., Western Europe, Southeast Asia")
    
    # Coordinates for weather API and mapping
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    
    # Rich descriptive content
    description = models.TextField(help_text="Brief, engaging description of the destination")
    image_url = models.URLField(blank=True, null=True, help_text="Hero image for the destination card")
    
    # Budget & Travel Info
    budget_level = models.CharField(
        max_length=20,
        choices=[
            ('budget', 'Budget-Friendly'),
            ('moderate', 'Moderate'),
            ('luxury', 'Luxury'),
        ],
        default='moderate'
    )
    
    avg_cost_per_day = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        help_text="Average daily cost in USD"
    )
    
    # Categories for filtering (stored as comma-separated values for simplicity)
    categories = models.CharField(
        max_length=255,
        help_text="Comma-separated: beach, culture, adventure, food, history, nightlife, nature, shopping"
    )
    
    # Travel logistics
    best_months = models.CharField(
        max_length=100,
        help_text="Best months to visit (e.g., 'Apr-Jun, Sep-Oct')"
    )
    
    # Popularity & Search metrics
    popularity_score = models.IntegerField(
        default=50,
        help_text="1-100 ranking for featured/trending destinations"
    )
    
    is_featured = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-popularity_score', 'city']
        indexes = [
            models.Index(fields=['city', 'country']),
            models.Index(fields=['budget_level']),
            models.Index(fields=['popularity_score']),
        ]
    
    def __str__(self):
        return f"{self.city}, {self.country}"
    
    def get_categories_list(self):
        """Return categories as a Python list"""
        return [cat.strip() for cat in self.categories.split(',')]
    
    @property
    def display_name(self):
        return f"{self.city}, {self.country}"
